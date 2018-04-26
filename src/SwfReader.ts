import { readFileSync } from 'fs';
import { inflateSync } from 'zlib';
import AbcFileReader from './abcFile/AbcFileReader';
import SmarterBuffer from './SmarterBuffer';
import { IHeader, ISwf, SwfSignature, Tag, TagCode } from './Types';

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
    const frameRate = this.buffer.readFixed(16);
    const frameCount = this.buffer.readUInt16LE();
    return { signature, version, fileLength, frameSize, frameRate, frameCount };
  }

  private getTags(): Tag[] {
    const tags: Tag[] = [];
    let tag: Tag;
    do {
      tag = this.readTag();
      tags.push(tag);
    } while (tag.code !== TagCode.End);
    return tags;
  }

  private readTag(): Tag {
    const tagCodeAndLength = this.buffer.readUInt16LE();
    const code: TagCode = tagCodeAndLength >> 6;
    let length = tagCodeAndLength & 63;
    if (length === 63) {
      length = this.buffer.readInt32LE();
    }
    const data = this.buffer.readBuffer(length);
    switch (code) {
      /**
       * A partir de la page 18 de la spec
       * https://wwwimages2.adobe.com/content/dam/acom/en/devnet/pdf/avm2overview.pdf
       */
      case TagCode.DoABC:
        const dataBuffer = SmarterBuffer.fromBuffer(data);
        const flags = dataBuffer.readUInt32LE();
        const name = dataBuffer.readStringNT();
        const abcFileReader = new AbcFileReader(dataBuffer);
        return {
          code,
          length,
          name,
          flags,
          abcFile: abcFileReader.readFile(),
        };
      case TagCode.End:
        return { code, length };
      default:
        return { code, length, data };
    }
  }

  private readPath()  {
    this.buffer = SmarterBuffer.fromBuffer(readFileSync(this.path));
  }
}
