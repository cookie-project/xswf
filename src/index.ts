import { readFileSync } from 'fs';
import { SmartBuffer, SmartBufferOptions } from 'smart-buffer';
import { inflateSync } from 'zlib';

export interface ISwfHeader {
  signature: string;
  version: number;
  fileLength: number;
  fileData: Buffer;
  fileBuffer: SmartBuffer;
}

export function getHeader(path: string): ISwfHeader {
  const data = readFileSync(path);
  const buffer = SmartBuffer.fromBuffer(data);
  const signature = String.fromCharCode(buffer.readUInt8(), buffer.readUInt8(), buffer.readUInt8());
  const version = buffer.readUInt8();
  const fileLength = buffer.readUInt32LE();
  const fileData = buffer.readBuffer(fileLength);
  const isCompressed = signature[0] === 'C';
  const fileBuffer = SmartBuffer.fromBuffer(isCompressed ? inflateSync(fileData) : fileData);
  const header: ISwfHeader = { signature, version, fileLength, fileData, fileBuffer };
  return header;
}
