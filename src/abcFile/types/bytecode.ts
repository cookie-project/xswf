import { IMultinameInfo } from "./multiname";

export enum InstructionCode {
  add = 0xa0,
  add_i = 0xc5,
  astype = 0x86,
  astypelate = 0x87,
  bitand = 0xa8,
  bitnot = 0x97,
  bitor = 0xa9,
  bitxor = 0xaa,
  call = 0x41,
  callmethod = 0x43,
  callproperty = 0x46,
  callproplex = 0x4c,
  callpropvoid = 0x4f,
  callstatic = 0x44,
  callsuper = 0x45,
  callsupervoid = 0x4e,
  checkfilter = 0x78,
  coerce = 0x80,
  coerce_a = 0x82,
  coerce_s = 0x85,
  construct = 0x42,
  contructprop = 0x4a,
  constructsuper = 0x49,
  convert_b = 0x76,
  convert_i = 0x73,
  convert_d = 0x75,
  convert_o = 0x77,
  convert_u = 0x74,
  convert_s = 0x70,
  debug = 0xef,
  debugfile = 0xf1,
  debugline = 0xf0,
  declocal = 0x94,
  declocal_i = 0xc3,
  decrement = 0x93,
  decrement_i = 0xc1,
  deleteproperty = 0x6a,
  divide = 0xa3,
  dup = 0x2a,
  dxns = 0x06,
  dxnslate = 0x07,
  equals = 0xab,
  esc_xattr = 0x72,
  esc_xelem = 0x71,
  findproperty = 0x5e,
  findpropstrict = 0x5d,
  getdescendants = 0x59,
  getglobalscope = 0x64,
  getglobalslot = 0x6e,
  getlex = 0x60,
  getlocal = 0x62,
  getlocal_0 = 0xd0,
  getlocal_1 = 0xd1,
  getlocal_2 = 0xd2,
  getlocal_3 = 0xd3,
  getproperty = 0x66,
  getscopeobject = 0x65,
  getslot = 0x6c,
  getsuper = 0x04,
  greaterequals = 0xb0,
  greaterthan = 0xaf,
  hasnext = 0x1f,
  hasnext2 = 0x32,
  ifeq = 0x13,
  iffalse = 0x12,
  ifge = 0x18,
  ifgt = 0x17,
  ifle = 0x16,
  iflt = 0x15,
  ifnge = 0x0f,
  ifngt = 0x0e,
  ifnle = 0x0d,
  ifnlt = 0x0c,
  ifne = 0x14,
  ifstricteq = 0x19,
  ifstrictne = 0x1a,
  iftrue = 0x11,
  in = 0xb4,
  inclocal = 0x92,
  inclocal_i = 0xc2,
  increment = 0x91,
  increment_i = 0xc0,
  initproperty = 0x68,
  instanceof = 0xb1,
  istype = 0xb2,
  istypelate = 0xb3,
  jump = 0x10,
  kill = 0x08,
  label = 0x09,
  lessequals = 0xae,
  lessthan = 0xad,
  lookupswitch = 0x1b,
  lshift = 0xa5,
  modulo = 0xa4,
  multiply = 0xa2,
  multiply_i = 0xc7,
  negate = 0x90,
  negate_i = 0xc4,
  newactivation = 0x57,
  newarray = 0x56,
  newcatch = 0x5a,
  newclass = 0x58,
  newfunction = 0x40,
  newobject = 0x55,
  nextname = 0x1e,
  nextvalue = 0x23,
  nop = 0x02,
  not = 0x96,
  pop = 0x29,
  popscope = 0x1d,
  pushbyte = 0x24,
  pushdouble = 0x2f,
  pushfalse = 0x27,
  pushint = 0x2d,
  pushnamespace = 0x31,
  pushnan = 0x28,
  pushnull = 0x20,
  pushscope = 0x30,
  pushshort = 0x25,
  pushstring = 0x2c,
  pushtrue = 0x26,
  pushuint = 0x2e,
  undefined = 0x21,
  pushwith = 0x1c,
  returnvalue = 0x48,
  returnvoid = 0x47,
  rshift = 0xa6,
  setlocal = 0x63,
  setlocal_0 = 0xd4,
  setlocal_1 = 0xd5,
  setlocal_2 = 0xd6,
  setlocal_3 = 0xd7,
  setglobalslot = 0x6f,
  setproperty = 0x61,
  setslot = 0x6d,
  setsuper = 0x05,
  strictequals = 0xac,
  subtract = 0xa1,
  subtract_i = 0xc6,
  swap = 0x2b,
  throw = 0x03,
  typeof = 0x95,
  urshift = 0xa7,
  applytype = 0x53,
  bkpt = 0x01,
  lf32 = 0x38,
  lf64 = 0x39,
  li16 = 0x36,
  li32 = 0x37,
  li8 = 0x35,
  sf32 = 0x3d,
  sf64 = 0x3e,
  si16 = 0x3b,
  si32 = 0x3c,
  si8 = 0x3a,
  sxi1 = 0x50,
  sxi16 = 0x52,
  sxi8 = 0x51
}

export interface IInstruction {
  code: InstructionCode;
  byteOffset?: number;
}

export interface ISxi1Instr extends IInstruction {
  code: InstructionCode.sxi1;
}

export interface ISxi16Instr extends IInstruction {
  code: InstructionCode.sxi16;
}

export interface ISxi8Instr extends IInstruction {
  code: InstructionCode.sxi8;
}

export interface ISf32Instr extends IInstruction {
  code: InstructionCode.sf32;
}

export interface ISf64Instr extends IInstruction {
  code: InstructionCode.sf64;
}

export interface ISi16Instr extends IInstruction {
  code: InstructionCode.si16;
}

export interface ISi32Instr extends IInstruction {
  code: InstructionCode.si32;
}

export interface ISi8Instr extends IInstruction {
  code: InstructionCode.si8;
}

export interface ILf32Instr extends IInstruction {
  code: InstructionCode.lf32;
}

export interface ILf64Instr extends IInstruction {
  code: InstructionCode.lf64;
}

export interface ILi16Instr extends IInstruction {
  code: InstructionCode.li16;
}

export interface ILi32Instr extends IInstruction {
  code: InstructionCode.li32;
}

export interface ILi8Instr extends IInstruction {
  code: InstructionCode.li8;
}

export interface IBkptInstr extends IInstruction {
  code: InstructionCode.bkpt;
}

export interface IApplytypeInstr extends IInstruction {
  code: InstructionCode.applytype;
}

export interface IAddInstr extends IInstruction {
  code: InstructionCode.add;
}

export interface IAddIInstr extends IInstruction {
  code: InstructionCode.add_i;
}

export interface IAstypeInstr extends IInstruction {
  code: InstructionCode.astype;
  operand0: number;
}

export interface IAstypelateInstr extends IInstruction {
  code: InstructionCode.astypelate;
}

export interface IBitandInstr extends IInstruction {
  code: InstructionCode.bitand;
}

export interface IBitnotInstr extends IInstruction {
  code: InstructionCode.bitnot;
}

export interface IBitorInstr extends IInstruction {
  code: InstructionCode.bitor;
}

export interface IBitxorInstr extends IInstruction {
  code: InstructionCode.bitxor;
}

export interface ICallInstr extends IInstruction {
  code: InstructionCode.call;
  operand0: number;
}

export interface ICallmethodInstr extends IInstruction {
  code: InstructionCode.callmethod;
  operand0: number;
  operand1: number;
}

export interface ICallpropertyInstr extends IInstruction {
  code: InstructionCode.callproperty;
  name: IMultinameInfo;
  argCount: number;
}

export interface ICallproplexInstr extends IInstruction {
  code: InstructionCode.callproplex;
  operand0: number;
  operand1: number;
}

export interface ICallpropvoidInstr extends IInstruction {
  code: InstructionCode.callpropvoid;
  name: IMultinameInfo;
  argCount: number;
}

export interface ICallstaticInstr extends IInstruction {
  code: InstructionCode.callstatic;
  operand0: number;
  operand1: number;
}

export interface ICallsuperInstr extends IInstruction {
  code: InstructionCode.callsuper;
  operand0: number;
  operand1: number;
}

export interface ICallsupervoidInstr extends IInstruction {
  code: InstructionCode.callsupervoid;
  operand0: number;
  operand1: number;
}

export interface ICheckfilterInstr extends IInstruction {
  code: InstructionCode.checkfilter;
}

export interface ICoerceInstr extends IInstruction {
  code: InstructionCode.coerce;
  operand0: number;
}

export interface ICoerceAInstr extends IInstruction {
  code: InstructionCode.coerce_a;
}

export interface ICoerceSInstr extends IInstruction {
  code: InstructionCode.coerce_s;
}

export interface IConstructInstr extends IInstruction {
  code: InstructionCode.construct;
  operand0: number;
}

export interface IContructpropInstr extends IInstruction {
  code: InstructionCode.contructprop;
  name: IMultinameInfo;
  argCount: number;
}

export interface IConstructsuperInstr extends IInstruction {
  code: InstructionCode.constructsuper;
  operand0: number;
}

export interface IConvertBInstr extends IInstruction {
  code: InstructionCode.convert_b;
}

export interface IConvertIInstr extends IInstruction {
  code: InstructionCode.convert_i;
}

export interface IConvertDInstr extends IInstruction {
  code: InstructionCode.convert_d;
}

export interface IConvertOInstr extends IInstruction {
  code: InstructionCode.convert_o;
}

export interface IConvertUInstr extends IInstruction {
  code: InstructionCode.convert_u;
}

export interface IConvertSInstr extends IInstruction {
  code: InstructionCode.convert_s;
}

export interface IDebugInstr extends IInstruction {
  code: InstructionCode.debug;
  operand0: number;
  operand1: number;
  operand2: number;
  operand3: number;
}

export interface IDebugfileInstr extends IInstruction {
  code: InstructionCode.debugfile;
  operand0: number;
}

export interface IDebuglineInstr extends IInstruction {
  code: InstructionCode.debugline;
  operand0: number;
}

export interface IDeclocalInstr extends IInstruction {
  code: InstructionCode.declocal;
  operand0: number;
}

export interface IDeclocalIInstr extends IInstruction {
  code: InstructionCode.declocal_i;
  operand0: number;
}

export interface IDecrementInstr extends IInstruction {
  code: InstructionCode.decrement;
}

export interface IDecrementIInstr extends IInstruction {
  code: InstructionCode.decrement_i;
}

export interface IDeletepropertyInstr extends IInstruction {
  code: InstructionCode.deleteproperty;
  operand0: number;
}

export interface IDivideInstr extends IInstruction {
  code: InstructionCode.divide;
}

export interface IDupInstr extends IInstruction {
  code: InstructionCode.dup;
}

export interface IDxnsInstr extends IInstruction {
  code: InstructionCode.dxns;
  operand0: number;
}

export interface IDxnslateInstr extends IInstruction {
  code: InstructionCode.dxnslate;
}

export interface IEqualsInstr extends IInstruction {
  code: InstructionCode.equals;
}

export interface IEscXattrInstr extends IInstruction {
  code: InstructionCode.esc_xattr;
}

export interface IEscXelemInstr extends IInstruction {
  code: InstructionCode.esc_xelem;
}

export interface IFindpropertyInstr extends IInstruction {
  code: InstructionCode.findproperty;
  operand0: number;
}

export interface IFindpropstrictInstr extends IInstruction {
  code: InstructionCode.findpropstrict;
  name: IMultinameInfo;
}

export interface IGetdescendantsInstr extends IInstruction {
  code: InstructionCode.getdescendants;
  operand0: number;
}

export interface IGetglobalscopeInstr extends IInstruction {
  code: InstructionCode.getglobalscope;
}

export interface IGetglobalslotInstr extends IInstruction {
  code: InstructionCode.getglobalslot;
  operand0: number;
}

export interface IGetlexInstr extends IInstruction {
  code: InstructionCode.getlex;
  name: IMultinameInfo;
}

export interface IGetlocalInstr extends IInstruction {
  code: InstructionCode.getlocal;
  index: number;
}

export interface IGetlocal0Instr extends IInstruction {
  code: InstructionCode.getlocal_0;
}

export interface IGetlocal1Instr extends IInstruction {
  code: InstructionCode.getlocal_1;
}

export interface IGetlocal2Instr extends IInstruction {
  code: InstructionCode.getlocal_2;
}

export interface IGetlocal3Instr extends IInstruction {
  code: InstructionCode.getlocal_3;
}

export interface IGetpropertyInstr extends IInstruction {
  code: InstructionCode.getproperty;
  name: IMultinameInfo;
}

export interface IGetscopeobjectInstr extends IInstruction {
  code: InstructionCode.getscopeobject;
  operand0: number;
}

export interface IGetslotInstr extends IInstruction {
  code: InstructionCode.getslot;
  operand0: number;
}

export interface IGetsuperInstr extends IInstruction {
  code: InstructionCode.getsuper;
  operand0: number;
}

export interface IGreaterequalsInstr extends IInstruction {
  code: InstructionCode.greaterequals;
}

export interface IGreaterthanInstr extends IInstruction {
  code: InstructionCode.greaterthan;
}

export interface IHasnextInstr extends IInstruction {
  code: InstructionCode.hasnext;
}

export interface IHasnext2Instr extends IInstruction {
  code: InstructionCode.hasnext2;
  operand0: number;
  operand1: number;
}

export interface IIfeqInstr extends IInstruction {
  code: InstructionCode.ifeq;
  operand0: number;
}

export interface IIffalseInstr extends IInstruction {
  code: InstructionCode.iffalse;
  operand0: number;
}

export interface IIfgeInstr extends IInstruction {
  code: InstructionCode.ifge;
  operand0: number;
}

export interface IIfgtInstr extends IInstruction {
  code: InstructionCode.ifgt;
  operand0: number;
}

export interface IIfleInstr extends IInstruction {
  code: InstructionCode.ifle;
  operand0: number;
}

export interface IIfltInstr extends IInstruction {
  code: InstructionCode.iflt;
  operand0: number;
}

export interface IIfngeInstr extends IInstruction {
  code: InstructionCode.ifnge;
  operand0: number;
}

export interface IIfngtInstr extends IInstruction {
  code: InstructionCode.ifngt;
  operand0: number;
}

export interface IIfnleInstr extends IInstruction {
  code: InstructionCode.ifnle;
  operand0: number;
}

export interface IIfnltInstr extends IInstruction {
  code: InstructionCode.ifnlt;
  offset: number;
}

export interface IIfneInstr extends IInstruction {
  code: InstructionCode.ifne;
  operand0: number;
}

export interface IIfstricteqInstr extends IInstruction {
  code: InstructionCode.ifstricteq;
  operand0: number;
}

export interface IIfstrictneInstr extends IInstruction {
  code: InstructionCode.ifstrictne;
  operand0: number;
}

export interface IIftrueInstr extends IInstruction {
  code: InstructionCode.iftrue;
  operand0: number;
}

export interface IInInstr extends IInstruction {
  code: InstructionCode.in;
}

export interface IInclocalInstr extends IInstruction {
  code: InstructionCode.inclocal;
  operand0: number;
}

export interface IInclocalIInstr extends IInstruction {
  code: InstructionCode.inclocal_i;
  operand0: number;
}

export interface IIncrementInstr extends IInstruction {
  code: InstructionCode.increment;
}

export interface IIncrementIInstr extends IInstruction {
  code: InstructionCode.increment_i;
}

export interface IInitpropertyInstr extends IInstruction {
  code: InstructionCode.initproperty;
  operand0: number;
}

export interface IInstanceofInstr extends IInstruction {
  code: InstructionCode.instanceof;
}

export interface IIstypeInstr extends IInstruction {
  code: InstructionCode.istype;
  operand0: number;
}

export interface IIstypelateInstr extends IInstruction {
  code: InstructionCode.istypelate;
}

export interface IJumpInstr extends IInstruction {
  code: InstructionCode.jump;
  operand0: number;
}

export interface IKillInstr extends IInstruction {
  code: InstructionCode.kill;
  operand0: number;
}

export interface ILabelInstr extends IInstruction {
  code: InstructionCode.label;
}

export interface ILessequalsInstr extends IInstruction {
  code: InstructionCode.lessequals;
}

export interface ILessthanInstr extends IInstruction {
  code: InstructionCode.lessthan;
}

export interface ILookupswitchInstr extends IInstruction {
  code: InstructionCode.lookupswitch;
  operand0: number;
  cases: number[];
}

export interface ILshiftInstr extends IInstruction {
  code: InstructionCode.lshift;
}

export interface IModuloInstr extends IInstruction {
  code: InstructionCode.modulo;
}

export interface IMultiplyInstr extends IInstruction {
  code: InstructionCode.multiply;
}

export interface IMultiplyIInstr extends IInstruction {
  code: InstructionCode.multiply_i;
}

export interface INegateInstr extends IInstruction {
  code: InstructionCode.negate;
}

export interface INegateIInstr extends IInstruction {
  code: InstructionCode.negate_i;
}

export interface INewactivationInstr extends IInstruction {
  code: InstructionCode.newactivation;
}

export interface INewarrayInstr extends IInstruction {
  code: InstructionCode.newarray;
  operand0: number;
}

export interface INewcatchInstr extends IInstruction {
  code: InstructionCode.newcatch;
  operand0: number;
}

export interface INewclassInstr extends IInstruction {
  code: InstructionCode.newclass;
  operand0: number;
}

export interface INewfunctionInstr extends IInstruction {
  code: InstructionCode.newfunction;
  operand0: number;
}

export interface INewobjectInstr extends IInstruction {
  code: InstructionCode.newobject;
  operand0: number;
}

export interface INextnameInstr extends IInstruction {
  code: InstructionCode.nextname;
}

export interface INextvalueInstr extends IInstruction {
  code: InstructionCode.nextvalue;
}

export interface INopInstr extends IInstruction {
  code: InstructionCode.nop;
}

export interface INotInstr extends IInstruction {
  code: InstructionCode.not;
}

export interface IPopInstr extends IInstruction {
  code: InstructionCode.pop;
}

export interface IPopscopeInstr extends IInstruction {
  code: InstructionCode.popscope;
}

export interface IPushbyteInstr extends IInstruction {
  code: InstructionCode.pushbyte;
  byteValue: number;
}

export interface IPushdoubleInstr extends IInstruction {
  code: InstructionCode.pushdouble;
  value: number;
}

export interface IPushfalseInstr extends IInstruction {
  code: InstructionCode.pushfalse;
}

export interface IPushintInstr extends IInstruction {
  code: InstructionCode.pushint;
  operand0: number;
}

export interface IPushnamespaceInstr extends IInstruction {
  code: InstructionCode.pushnamespace;
  operand0: number;
}

export interface IPushnanInstr extends IInstruction {
  code: InstructionCode.pushnan;
}

export interface IPushnullInstr extends IInstruction {
  code: InstructionCode.pushnull;
}

export interface IPushscopeInstr extends IInstruction {
  code: InstructionCode.pushscope;
}

export interface IPushshortInstr extends IInstruction {
  code: InstructionCode.pushshort;
  operand0: number;
}

export interface IPushstringInstr extends IInstruction {
  code: InstructionCode.pushstring;
  value: string;
}

export interface IPushtrueInstr extends IInstruction {
  code: InstructionCode.pushtrue;
}

export interface IPushuintInstr extends IInstruction {
  code: InstructionCode.pushuint;
  operand0: number;
}

export interface IUndefinedInstr extends IInstruction {
  code: InstructionCode.undefined;
}

export interface IPushwithInstr extends IInstruction {
  code: InstructionCode.pushwith;
}

export interface IReturnvalueInstr extends IInstruction {
  code: InstructionCode.returnvalue;
}

export interface IReturnvoidInstr extends IInstruction {
  code: InstructionCode.returnvoid;
}

export interface IRshiftInstr extends IInstruction {
  code: InstructionCode.rshift;
}

export interface ISetlocalInstr extends IInstruction {
  code: InstructionCode.setlocal;
  index: number;
}

export interface ISetlocal0Instr extends IInstruction {
  code: InstructionCode.setlocal_0;
}

export interface ISetlocal1Instr extends IInstruction {
  code: InstructionCode.setlocal_1;
}

export interface ISetlocal2Instr extends IInstruction {
  code: InstructionCode.setlocal_2;
}

export interface ISetlocal3Instr extends IInstruction {
  code: InstructionCode.setlocal_3;
}

export interface ISetglobalslotInstr extends IInstruction {
  code: InstructionCode.setglobalslot;
  operand0: number;
}

export interface ISetpropertyInstr extends IInstruction {
  code: InstructionCode.setproperty;
  operand0: number;
}

export interface ISetslotInstr extends IInstruction {
  code: InstructionCode.setslot;
  operand0: number;
}

export interface ISetsuperInstr extends IInstruction {
  code: InstructionCode.setsuper;
  operand0: number;
}

export interface IStrictequalsInstr extends IInstruction {
  code: InstructionCode.strictequals;
}

export interface ISubtractInstr extends IInstruction {
  code: InstructionCode.subtract;
}

export interface ISubtractIInstr extends IInstruction {
  code: InstructionCode.subtract_i;
}

export interface ISwapInstr extends IInstruction {
  code: InstructionCode.swap;
}

export interface IThrowInstr extends IInstruction {
  code: InstructionCode.throw;
}

export interface ITypeofInstr extends IInstruction {
  code: InstructionCode.typeof;
}

export interface IUrshiftInstr extends IInstruction {
  code: InstructionCode.urshift;
}

export type Instruction =
  | ISxi1Instr
  | ISxi16Instr
  | ISxi8Instr
  | ISi8Instr
  | ISf32Instr
  | ISf64Instr
  | ISi16Instr
  | ISi32Instr
  | ILf32Instr
  | ILf64Instr
  | ILi16Instr
  | ILi32Instr
  | ILi8Instr
  | IBkptInstr
  | IApplytypeInstr
  | IAddInstr
  | IAddIInstr
  | IAstypeInstr
  | IAstypelateInstr
  | IBitandInstr
  | IBitnotInstr
  | IBitorInstr
  | IBitxorInstr
  | ICallInstr
  | ICallmethodInstr
  | ICallpropertyInstr
  | ICallproplexInstr
  | ICallpropvoidInstr
  | ICallstaticInstr
  | ICallsuperInstr
  | ICallsupervoidInstr
  | ICheckfilterInstr
  | ICoerceInstr
  | ICoerceAInstr
  | ICoerceSInstr
  | IConstructInstr
  | IContructpropInstr
  | IConstructsuperInstr
  | IConvertBInstr
  | IConvertIInstr
  | IConvertDInstr
  | IConvertOInstr
  | IConvertUInstr
  | IConvertSInstr
  | IDebugInstr
  | IDebugfileInstr
  | IDebuglineInstr
  | IDeclocalInstr
  | IDeclocalIInstr
  | IDecrementInstr
  | IDecrementIInstr
  | IDeletepropertyInstr
  | IDivideInstr
  | IDupInstr
  | IDxnsInstr
  | IDxnslateInstr
  | IEqualsInstr
  | IEscXattrInstr
  | IEscXelemInstr
  | IFindpropertyInstr
  | IFindpropstrictInstr
  | IGetdescendantsInstr
  | IGetglobalscopeInstr
  | IGetglobalslotInstr
  | IGetlexInstr
  | IGetlocalInstr
  | IGetlocal0Instr
  | IGetlocal1Instr
  | IGetlocal2Instr
  | IGetlocal3Instr
  | IGetpropertyInstr
  | IGetscopeobjectInstr
  | IGetslotInstr
  | IGetsuperInstr
  | IGreaterequalsInstr
  | IGreaterthanInstr
  | IHasnextInstr
  | IHasnext2Instr
  | IIfeqInstr
  | IIffalseInstr
  | IIfgeInstr
  | IIfgtInstr
  | IIfleInstr
  | IIfltInstr
  | IIfngeInstr
  | IIfngtInstr
  | IIfnleInstr
  | IIfnltInstr
  | IIfneInstr
  | IIfstricteqInstr
  | IIfstrictneInstr
  | IIftrueInstr
  | IInInstr
  | IInclocalInstr
  | IInclocalIInstr
  | IIncrementInstr
  | IIncrementIInstr
  | IInitpropertyInstr
  | IInstanceofInstr
  | IIstypeInstr
  | IIstypelateInstr
  | IJumpInstr
  | IKillInstr
  | ILabelInstr
  | ILessequalsInstr
  | ILessthanInstr
  | ILookupswitchInstr
  | ILshiftInstr
  | IModuloInstr
  | IMultiplyInstr
  | IMultiplyIInstr
  | INegateInstr
  | INegateIInstr
  | INewactivationInstr
  | INewarrayInstr
  | INewcatchInstr
  | INewclassInstr
  | INewfunctionInstr
  | INewobjectInstr
  | INextnameInstr
  | INextvalueInstr
  | INopInstr
  | INotInstr
  | IPopInstr
  | IPopscopeInstr
  | IPushbyteInstr
  | IPushdoubleInstr
  | IPushfalseInstr
  | IPushintInstr
  | IPushnamespaceInstr
  | IPushnanInstr
  | IPushnullInstr
  | IPushscopeInstr
  | IPushshortInstr
  | IPushstringInstr
  | IPushtrueInstr
  | IPushuintInstr
  | IUndefinedInstr
  | IPushwithInstr
  | IReturnvalueInstr
  | IReturnvoidInstr
  | IRshiftInstr
  | ISetlocalInstr
  | ISetlocal0Instr
  | ISetlocal1Instr
  | ISetlocal2Instr
  | ISetlocal3Instr
  | ISetglobalslotInstr
  | ISetpropertyInstr
  | ISetslotInstr
  | ISetsuperInstr
  | IStrictequalsInstr
  | ISubtractInstr
  | ISubtractIInstr
  | ISwapInstr
  | IThrowInstr
  | ITypeofInstr
  | IUrshiftInstr;
