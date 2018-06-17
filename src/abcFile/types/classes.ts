import { IInstanceInfo } from "./instance";
import { IMethodBody, IMethodInfo } from "./methods";
import { Trait } from "./trait";

export interface IClassInfo {
  instance: IInstanceInfo;
  cinit: IMethodInfo;
  cinitBody: IMethodBody;
  traitCount: number;
  traits: Trait[];
}
