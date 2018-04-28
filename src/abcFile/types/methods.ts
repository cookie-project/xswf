import { Constant } from './constant';
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

export interface IOptionInfo {
  count: number;
  options: Constant[];
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