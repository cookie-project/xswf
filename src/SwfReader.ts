import { readFileSync } from 'fs';
import { inflateSync } from 'zlib';
import SmarterBuffer from './SmarterBuffer';
import { IHeader, SwfSignature } from './Types';

/**
 * Spec: https://wwwimages2.adobe.com/content/dam/acom/en/devnet/pdf/swf-file-format-spec.pdf
 */
export default class SwfReader {
  private buffer: SmarterBuffer;

  constructor(path: string) {
    const buffer = readFileSync(path);
    this.buffer = SmarterBuffer.fromBuffer(buffer);
  }

  public getHeader(): IHeader {
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
}
