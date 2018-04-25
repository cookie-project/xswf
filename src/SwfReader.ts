import { readFileSync } from 'fs';
import { inflateSync } from 'zlib';
import SmarterBuffer from './SmarterBuffer';
import { IHeader, SwfCompression } from './Types';

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
    const signature: SwfCompression = signatureString as SwfCompression;
    const version = this.buffer.readUInt8();
    const fileLength = this.buffer.readUInt32LE();

    this.buffer = SmarterBuffer.fromBuffer(
      signature === SwfCompression.Zlib
        ? inflateSync(this.buffer.readBuffer(fileLength))
        : this.buffer.readBuffer(fileLength)
    );

    const frameSize = this.buffer.readRect();
    const frameRate = this.buffer.readUInt16LE();
    const frameCount = this.buffer.readUInt16LE();
    const header: IHeader = { signature, version, fileLength, frameSize, frameRate, frameCount };
    return header;
  }
}
