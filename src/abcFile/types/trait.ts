import { IClassInfo } from './classes';
import { Constant } from './constant';
import { IMethodInfo } from './methods';
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

export enum TraitAttribute {
  Final = 0x1,
  Override = 0x2,
  Metadata = 0x4,
}

export interface ITrait {
  name: MultinameInfo;
  kind: TraitKind;
  metadataCount?: number;
  metadata?: { key: string, value: string };
}

export interface ITraitSlot extends ITrait {
  kind: TraitKind.Slot | TraitKind.Const;
  slotId: number;
  typeName: MultinameInfo;
  value?: Constant;
}

export interface ITraitClass extends ITrait {
  kind: TraitKind.Class;
  class: IClassInfo;
}

export interface ITraitFunction extends ITrait {
  kind: TraitKind.Function;
  slotId: number;
  func: IMethodInfo;
}

export interface ITraitMethod extends ITrait {
  kind: TraitKind.Method | TraitKind.Getter | TraitKind.Setter;
  dispId: number;
  method: IMethodInfo;
}

export type Trait = ITraitSlot | ITraitClass | ITraitMethod | ITraitFunction;
