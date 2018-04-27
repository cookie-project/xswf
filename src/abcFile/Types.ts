export interface IAbcFile {
  minorVersion: number;
  majorVersion: number;
  constantPool: IConstantPool;
  methodCount: number;
  methods: IMethodInfo[];
  metadataCount: number;
  metadataInfo: IMetadataInfo;
  classCount: number;
  instance: IInstanceInfo;
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
  nsSetCount: number;
  nsSet: INamespaceSetInfo[];
  multinameCount: number;
  multinames: MultinameInfo[];
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
  TypeName = 0x1D,
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
  name: number;
  params: number[];
}

export type MultinameInfo = IQName | IRTQName | IRTQNameL | IMultiname | IMultinameL | ITypeName;

export enum MethodInfoFlag {
  NeedArguments = 0x01,
  NeedActivation = 0x02,
  NeedRest = 0x04,
  HasOptional = 0x08,
  SetDxns = 0x40,
  HasParamNames = 0x80,
}

export enum ConstantOptionKind {
  Int = 0x03,
  UInt = 0x04,
  Double = 0x06,
  Utf8 = 0x01,
  True = 0x0B,
  False = 0x0A,
  Null = 0x0C,
  Undefined = 0x00,
  Namespace = 0x08,
  PackageNamespace = 0x16,
  PackageInternalNs = 0x17,
  ProtectedNamespace = 0x18,
  ExplicitNamespace = 0x19,
  StaticProtectedNs = 0x1A,
  PrivateNs = 0x05,
}

export interface IOptionDetail {
  val: number | string | INamespaceInfo;
  kind: ConstantOptionKind;
}

export interface IOptionInfo {
  count: number;
  options: IOptionDetail[];
}

export interface IParamInfos {
  names: string[];
}

export interface IMethodInfo {
  paramCount: number;
  returnType: MultinameInfo;
  paramTypes: MultinameInfo[];
  name: string;
  flags: number;
  options?: IOptionInfo;
  paramNames?: IParamInfos;
}

export interface IMetadataInfo {
  name: string;
  itemCount: number;
  keys: string[];
  values: string[];
}

export interface ITrait {
  name: MultinameInfo;
  kind: number;
  data: any[];
  metadataCount?: number;
  metadata?: { key: string, value: string };
}

export enum InstanceInfoFlag {
  ClassSealed = 0x01,
  ClassFinal = 0x02,
  ClassInterface = 0x04,
  ClassProtectedNs = 0x08,
}

export interface IInstanceInfo {
  name: MultinameInfo;
  supername: MultinameInfo;
  flags: number;
  protectedNs?: INamespaceInfo;
  interfaceCount: number;
  interfaces: MultinameInfo[];
  iinit: IMethodInfo;
  traitCount: number;
  traits: ITrait[];
}

export enum TraitType {
  Slot = 0,
  Method = 1,
  Getter = 2,
  Setter = 3,
  Class = 4,
  Function = 5,
  Const = 6,
}

export interface ITrait {
  slotId: number;
}

export interface ITraitSlot extends ITrait {
  typeName: MultinameInfo;
  vIndex: number;
  vKind: number;
}

export interface ITraitClass extends ITrait {
  class: number;
}
