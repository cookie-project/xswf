import { MultinameInfo } from './multiname';

export interface ITrait {
  name: MultinameInfo;
  kind: number;
  data: any[];
  metadataCount?: number;
  metadata?: { key: string, value: string };
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
