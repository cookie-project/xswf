// export type SwfCompression = 'FWS' | 'CWS' | 'ZWS';

export enum SwfCompression {
  None = 'FWS',
  Zlib = 'CWS',
  Lzma = 'ZWS',
}

export enum TagCode {
  End = 0,
  DoABC = 82,
}

export interface IHeader {
  signature: SwfCompression;
  version: number;
  fileLength: number;
  frameSize: IRect;
  frameRate: number;
  frameCount: number;
}

export interface ITag {
  code: TagCode;
  length: number;
}

export interface ITagDoABC {
  tag: ITag;
  flags: number;
  name: string;
  data: Buffer;
}

export interface ISwf {
  header: IHeader;
  tags: ITag[];
}

export interface IRect {
  nBits: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
