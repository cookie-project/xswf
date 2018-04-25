import { readFileSync } from 'fs';
import CustomBuffer from './CustomBuffer';
import { IHeader, SwfCompression } from './Types';

export default class SwfReader {
  private buffer: CustomBuffer;

  constructor(path: string) {
    const buffer = readFileSync(path);
    this.buffer = CustomBuffer.fromBuffer(buffer);
  }

  public getHeader(): IHeader {
    const signatureString = String.fromCharCode(...[
      this.buffer.readUInt8(), this.buffer.readUInt8(), this.buffer.readUInt8(),
    ]);
    const signature: SwfCompression = signatureString as SwfCompression;
    const version = this.buffer.readUInt8();
    const fileLength = this.buffer.readUInt32LE();
    const frameSize = this.buffer.readRect();
    const frameRate = this.buffer.readUInt16LE();
    const frameCount = this.buffer.readUInt16LE();
    const header: IHeader = { signature, version, fileLength, frameSize, frameRate, frameCount };
    return header;
  }
}
