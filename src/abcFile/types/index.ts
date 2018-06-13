import { IClassInfo } from "./classes";
import { IInstanceInfo } from "./instance";
import { IMethodBody, IMethodInfo } from "./methods";
import { MultinameInfo } from "./multiname";
import { INamespaceInfo, INamespaceSetInfo } from "./namespace";
import { IScriptInfo } from "./scripts";

export interface IAbcFile {
  minorVersion: number;
  majorVersion: number;
  constantPool: IConstantPool;
  methodCount: number;
  methods: IMethodInfo[];
  metadataCount: number;
  metadataInfos: IMetadataInfo[];
  classCount: number;
  instances: IInstanceInfo[];
  classes: IClassInfo[];
  scriptCount: number;
  scripts: IScriptInfo[];
  methodBodyCount: number;
  methodBodies: IMethodBody[];
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

export interface IMetadataInfo {
  name: string;
  itemCount: number;
  keys: string[];
  values: string[];
}
