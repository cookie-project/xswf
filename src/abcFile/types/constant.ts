import { INamespaceInfo } from "./namespace";

export enum ConstantKind {
  Int = 0x03,
  UInt = 0x04,
  Double = 0x06,
  Utf8 = 0x01,
  True = 0x0b,
  False = 0x0a,
  Null = 0x0c,
  Undefined = 0x00,
  Namespace = 0x08,
  PackageNamespace = 0x16,
  PackageInternalNs = 0x17,
  ProtectedNamespace = 0x18,
  ExplicitNamespace = 0x19,
  StaticProtectedNs = 0x1a,
  PrivateNs = 0x05
}

export interface IConstant {
  kind: ConstantKind;
  val: number | true | false | string | null | undefined | INamespaceInfo;
}

export interface INumberConstant extends IConstant {
  kind: ConstantKind.Int | ConstantKind.UInt | ConstantKind.Double;
  val: number;
}

export interface IUtf8Constant extends IConstant {
  kind: ConstantKind.Utf8;
  val: string;
}

export interface ITrueConstant extends IConstant {
  kind: ConstantKind.True;
  val: true;
}

export interface IFalseConstant extends IConstant {
  kind: ConstantKind.False;
  val: false;
}

export interface INullConstant extends IConstant {
  kind: ConstantKind.Null;
  val: null;
}

export interface IUndefinedConstant extends IConstant {
  kind: ConstantKind.Undefined;
  val: undefined;
}

export interface INamespaceConstant extends IConstant {
  kind:
    | ConstantKind.PackageNamespace
    | ConstantKind.PackageInternalNs
    | ConstantKind.ProtectedNamespace
    | ConstantKind.ExplicitNamespace
    | ConstantKind.StaticProtectedNs
    | ConstantKind.PrivateNs
    | ConstantKind.Namespace;
  val: INamespaceInfo;
}

export type Constant =
  | INumberConstant
  | IUtf8Constant
  | ITrueConstant
  | IFalseConstant
  | INullConstant
  | IUndefinedConstant
  | INamespaceConstant;
