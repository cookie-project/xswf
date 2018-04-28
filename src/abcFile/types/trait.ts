import { Constant } from './constant';
import { MultinameInfo } from './multiname';
import { INamespaceInfo } from './namespace';

export enum TraitKind {
  Slot = 0,
  Method = 1,
  Getter = 2,
  Setter = 3,
  Class = 4,
  Function = 5,
  Const = 6,
}

export interface ITrait {
  name: MultinameInfo;
  kind: TraitKind;
  metadataCount?: number;
  metadata?: { key: string, value: string };
}

export interface ITraitSlot extends ITrait {
  kind: TraitKind.Slot | TraitKind.Const;
  typeName: MultinameInfo;
  value: Constant;
}

export interface ITraitClass extends ITrait {
  class: number;
}
