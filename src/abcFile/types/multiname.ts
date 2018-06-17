import { INamespaceInfo, INamespaceSetInfo } from "./namespace";

export enum MultinameKind {
  QName = 0x07,
  QNameA = 0x0d,
  RTQName = 0x0f,
  RTQNameA = 0x10,
  RTQNAmeL = 0x11,
  RTQNameLA = 0x12,
  Multiname = 0x09,
  MultinameA = 0x0e,
  MultinameL = 0x1b,
  MultinameLA = 0x1c,
  TypeName = 0x1d
}

export interface IMultinameInfo {
  kind: MultinameKind;
}

export interface IQName extends IMultinameInfo {
  kind: MultinameKind.QName | MultinameKind.QNameA;
  ns: INamespaceInfo;
  name: string;
}

export interface IRTQName extends IMultinameInfo {
  kind: MultinameKind.RTQName | MultinameKind.RTQNameA;
  name: string;
}

export interface IRTQNameL extends IMultinameInfo {
  kind: MultinameKind.RTQNAmeL | MultinameKind.RTQNameLA;
}

export interface IMultiname extends IMultinameInfo {
  kind: MultinameKind.Multiname | MultinameKind.MultinameA;
  name: string;
  nsSet: INamespaceSetInfo;
}

export interface IMultinameL extends IMultinameInfo {
  kind: MultinameKind.MultinameL | MultinameKind.MultinameLA;
  nsSet: INamespaceSetInfo;
}

export interface ITypeName extends IMultinameInfo {
  kind: MultinameKind.TypeName;
  name: MultinameInfo;
  names: MultinameInfo[];
}

export type MultinameInfo =
  | IQName
  | IRTQName
  | IRTQNameL
  | IMultiname
  | IMultinameL
  | ITypeName;
