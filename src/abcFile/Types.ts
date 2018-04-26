export interface IAbcFile {
  minorVersion: number;
  majorVersion: number;
  constantPool: IConstantPool;
}

export interface IConstantPool {
  intCount: number;
  integers: number[];
  uintCount: number;
  uintegers: number[];
  doubleCount: number;
  doubles: number[];
  stringCount: number;
  strings: string[];
  namespaceCount: number;
  namespaces: INamespaceInfo[];
}

export interface INamespaceInfo {
  kind: NamespaceKind;
  name: string;
}

export enum NamespaceKind {
  Namespace = 0x08,
  PackageNamespace = 0x16,
  PackageInternalNs = 0x17,
  ProtectedNamespace = 0x18,
  ExplicitNamespace = 0x19,
  StaticProtectedNs = 0x1A,
  PrivateNs = 0x05,
}

export interface INamespaceSetInfo {
  count: number;
  namespaces: INamespaceInfo[];
}

export enum MultinameKind {
  QName = 0x07,
  QNameA = 0x0D,
  RTQName = 0x0F,
  RTQNameA = 0x10,
  RTQNAmeL = 0x11,
  RTQNameLA = 0x12,
  Multiname = 0x09,
  MultinameA = 0x0E,
  MultinameL = 0x1B,
  MultinameLA = 0x1C,
}

export interface IMultinameInfo {
  kind: MultinameKind;
}

export interface IQName {
  kind: MultinameKind.QName | MultinameKind.QNameA;
  ns: INamespaceInfo;
  name: string;
}

export interface IRTQName {
  kind: MultinameKind.RTQName | MultinameKind.RTQNameA;
  name: string;
}

export interface IRTQNameL {
  kind: MultinameKind.RTQNAmeL | MultinameKind.RTQNAmeL;
}

export interface IMultiname {
  kind: MultinameKind.Multiname | MultinameKind.MultinameA;
  name: string;
  nsSet: INamespaceSetInfo;
}

export interface IMultinameL {
  kind: MultinameKind.MultinameL | MultinameKind.MultinameLA;
  nsSet: INamespaceSetInfo;
}

export type MultinameInfo = IQName | IRTQName | IRTQNameL | IMultiname | IMultinameL;
