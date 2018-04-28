import { IMethodInfo } from './methods';
import { Trait } from './trait';

export interface IScriptInfo {
  init: IMethodInfo;
  traitCount: number;
  traits: Trait[];
}
