import { IClassInfo } from "./classes";
import { Constant } from "./constant";
import { IMethodBody, IMethodInfo } from "./methods";
import { IQName, MultinameInfo } from "./multiname";

export enum TraitKind {
  Slot = 0,
  Method = 1,
  Getter = 2,
  Setter = 3,
  Class = 4,
  Function = 5,
  Const = 6
}

export enum TraitAttribute {
  Final = 0x1,
  Override = 0x2,
  Metadata = 0x4
}

export interface ITrait {
  name: IQName;
  kind: TraitKind;
  metadataCount?: number;
  metadata?: { key: string; value: string };
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
  funcBody: IMethodBody;
}

export interface ITraitMethod extends ITrait {
  kind: TraitKind.Method | TraitKind.Getter | TraitKind.Setter;
  attribute: TraitAttribute;
  dispId: number;
  method: IMethodInfo;
  methodBody: IMethodBody;
}

export type Trait = ITraitSlot | ITraitClass | ITraitMethod | ITraitFunction;
