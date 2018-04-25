import { readFileSync } from 'fs';
import { inflateSync } from 'zlib';
import SmarterBuffer from './SmarterBuffer';
import { IHeader, ISwf, ITag, SwfSignature, TagCode } from './Types';

/**
 * Spec: https://wwwimages2.adobe.com/content/dam/acom/en/devnet/pdf/swf-file-format-spec.pdf
 */
export default class SwfReader {
  private path: string;
  private buffer: SmarterBuffer;

  constructor(path: string) {
    this.path = path;
    this.readPath();
  }

  public getFile(): ISwf {
    const header = this.getHeader();
    const tags = this.getTags();
    return { header, tags };
  }

  private getHeader(): IHeader {
    this.readPath();
    const signatureString = String.fromCharCode(...[
      this.buffer.readUInt8(), this.buffer.readUInt8(), this.buffer.readUInt8(),
    ]);
    const signature: SwfSignature = signatureString as SwfSignature;
    const version = this.buffer.readUInt8();
    const fileLength = this.buffer.readUInt32LE();

    this.buffer = SmarterBuffer.fromBuffer(
      signature === SwfSignature.Zlib
        ? inflateSync(this.buffer.readBuffer())
        : this.buffer.readBuffer(),
    );

    const frameSize = this.buffer.readRect();
    const frameRate = this.buffer.readUInt16LE();
    const frameCount = this.buffer.readUInt16LE();
    const header: IHeader = { signature, version, fileLength, frameSize, frameRate, frameCount };
    return header;
  }

  private getTags(): ITag[] {
    const tags: ITag[] = [];
    let tag: ITag;
    do {
      tag = this.readTag();
      tags.push(tag);
    } while (tag.code !== TagCode.End);
    return tags;
  }

  private readTag(): ITag {
    const tagCodeAndLength = this.buffer.readUInt16LE();
    const code = tagCodeAndLength >> 6;
    let length = tagCodeAndLength & 63;
    if (length === 63) {
      length = this.buffer.readInt32LE();
    }
    const data = this.buffer.readBuffer(length);
    return { code, length, data };
  }

  private readPath()  {
    this.buffer = SmarterBuffer.fromBuffer(readFileSync(this.path));
  }
}
