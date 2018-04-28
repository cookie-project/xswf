import { IMethodInfo } from './methods';
import { Trait } from './trait';

export interface IClassInfo {
  cinit: IMethodInfo;
  traitCount: number;
  traits: Trait[];
}
