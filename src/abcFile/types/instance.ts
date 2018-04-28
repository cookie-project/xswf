import { IClassInfo } from './classes';
import { IMethodInfo } from './methods';
import { MultinameInfo } from './multiname';
import { INamespaceInfo } from './namespace';
import { Trait } from './trait';

export enum InstanceInfoFlag {
  ClassSealed = 0x01,
  ClassFinal = 0x02,
  ClassInterface = 0x04,
  ClassProtectedNs = 0x08,
}

export interface IInstanceInfo {
  class: IClassInfo;
  name: MultinameInfo;
  supername: MultinameInfo;
  flags: number;
  protectedNs?: INamespaceInfo;
  interfaceCount: number;
  interfaces: MultinameInfo[];
  iinit: IMethodInfo;
  traitCount: number;
  traits: Trait[];
}
