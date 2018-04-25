import { IAbcFile } from './abcFile/Types';

// export type SwfCompression = 'FWS' | 'CWS' | 'ZWS';

export enum SwfSignature {
  None = 'FWS',
  Zlib = 'CWS',
  Lzma = 'ZWS',
}

export enum TagCode {
  End = 0,
  ShowFrame = 1,
  DefineShape = 2,
  PlaceObject = 4,
  RemoveObject = 5,
  DefineBits = 6,
  DefineButton = 7,
  JPEGTables = 8,
  SetBackgroundColor = 9,
  DefineFont = 10,
  DefineText = 11,
  DoAction = 12,
  DefineFontInfo = 13,
  DefineSound = 14,
  StartSound = 15,
  DefineButtonSound = 17,
  SoundStreamHead = 18,
  SoundStreamBlock = 19,
  DefineBitsLossless = 20,
  DefineBitsJPEG2 = 21,
  DefineShape2 = 22,
  DefineButtonCxform = 23,
  Protect = 24,
  PlaceObject2 = 26,
  RemoveObject2 = 28,
  DefineShape3 = 32,
  DefineText2 = 33,
  DefineButton2 = 34,
  DefineBitsJPEG3 = 35,
  DefineBitsLossless2 = 36,
  DefineEditText = 37,
  DefineSprite = 39,
  ProductInfo = 41,
  FrameLabel = 43,
  SoundStreamHead2 = 45,
  DefineMorphShape = 46,
  DefineFont2 = 48,
  ExportAssets = 56,
  ImportAssets = 57,
  EnableDebugger = 58,
  DoInitAction = 59,
  DefineVideoStream = 60,
  VideoFrame = 61,
  DefineFontInfo2 = 62,
  EnableDebugger2 = 64,
  ScriptLimits = 65,
  SetTabIndex = 66,
  FileAttributes = 69,
  PlaceObject3 = 70,
  ImportAssets2 = 71,
  DefineFontAlignZones = 73,
  CSMTextSettings = 74,
  DefineFont3 = 75,
  SymbolClass = 76,
  Metadata = 77,
  DefineScalingGrid = 78,
  DoABC = 82,
  DefineShape4 = 83,
  DefineMorphShape2 = 84,
  DefineSceneAndFrameLabelData = 86,
  DefineBinaryData = 87,
  DefineFontName = 88,
  StartSound2 = 89,
  DefineBitsJPEG4 = 90,
  DefineFont4 = 91,
}

export interface IHeader {
  signature: SwfSignature;
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

export interface ITagDoAbc extends ITag {
  code: TagCode.DoABC;
  abcFile: IAbcFile;
}

export interface ITagEnd extends ITag {
  code: TagCode.End;
}

export interface ITagOther extends ITag {
  code: TagCode.ShowFrame  | TagCode.DefineShape  | TagCode.PlaceObject  | TagCode.RemoveObject
  | TagCode.DefineBits  | TagCode.DefineButton  | TagCode.JPEGTables  | TagCode.SetBackgroundColor
  | TagCode.DefineFont  | TagCode.DefineText  | TagCode.DoAction  | TagCode.DefineFontInfo  | TagCode.DefineSound
  | TagCode.StartSound  | TagCode.DefineButtonSound  | TagCode.SoundStreamHead  | TagCode.SoundStreamBlock
  | TagCode.DefineBitsLossless  | TagCode.DefineBitsJPEG2  | TagCode.DefineShape2  | TagCode.DefineButtonCxform
  | TagCode.Protect  | TagCode.PlaceObject2  | TagCode.RemoveObject2  | TagCode.DefineShape3  | TagCode.DefineText2
  | TagCode.DefineButton2  | TagCode.DefineBitsJPEG3  | TagCode.DefineBitsLossless2  | TagCode.DefineEditText
  | TagCode.DefineSprite  | TagCode.ProductInfo  | TagCode.FrameLabel  | TagCode.SoundStreamHead2
  | TagCode.DefineMorphShape  | TagCode.DefineFont2  | TagCode.ExportAssets  | TagCode.ImportAssets
  | TagCode.EnableDebugger  | TagCode.DoInitAction  | TagCode.DefineVideoStream  | TagCode.VideoFrame
  | TagCode.DefineFontInfo2  | TagCode.EnableDebugger2  | TagCode.ScriptLimits  | TagCode.SetTabIndex
  | TagCode.FileAttributes  | TagCode.PlaceObject3  | TagCode.ImportAssets2  | TagCode.DefineFontAlignZones
  | TagCode.CSMTextSettings  | TagCode.DefineFont3  | TagCode.SymbolClass  | TagCode.Metadata
  | TagCode.DefineScalingGrid  | TagCode.DefineShape4  | TagCode.DefineMorphShape2
  | TagCode.DefineSceneAndFrameLabelData  | TagCode.DefineBinaryData  | TagCode.DefineFontName
  | TagCode.StartSound2  | TagCode.DefineBitsJPEG4  | TagCode.DefineFont4;
  data: Buffer;
}

export type Tag = ITagDoAbc | ITagEnd | ITagOther;

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
