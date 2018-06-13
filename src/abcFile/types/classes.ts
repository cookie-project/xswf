import { IInstanceInfo } from "./instance";
import { IMethodInfo } from "./methods";
import { Trait } from "./trait";

export interface IClassInfo {
  instance: IInstanceInfo;
  cinit: IMethodInfo;
  traitCount: number;
  traits: Trait[];
}
