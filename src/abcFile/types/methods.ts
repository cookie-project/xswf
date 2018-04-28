import { MultinameInfo } from './multiname';
import { INamespaceInfo } from './namespace';

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
