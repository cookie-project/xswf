import { readFileSync } from 'fs';
import CustomBuffer from './CustomBuffer';
import { IHeader, SwfCompression } from './Types';

export function getHeader(path: string): IHeader {
  const data = readFileSync(path);
  const buffer = CustomBuffer.fromBuffer(data);
  const signatureString = String.fromCharCode(buffer.readUInt8(), buffer.readUInt8(), buffer.readUInt8());
  const signature: SwfCompression = signatureString as SwfCompression;
  const version = buffer.readUInt8();
  const fileLength = buffer.readUInt32LE();
  const frameSize = buffer.readRect();
  const frameRate = buffer.readUInt16LE();
  const frameCount = buffer.readUInt16LE();
  const header: IHeader = { signature, version, fileLength, frameSize, frameRate, frameCount };
  return header;
}
