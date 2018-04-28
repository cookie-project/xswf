
export enum InstructionCode {
  Op_add = 0xa0,
  Op_add_i = 0xc5,
  Op_astype = 0x86,
  Op_astypelate = 0x87,
  Op_bitand = 0xa8,
  Op_bitnot = 0x97,
  Op_bitor = 0xa9,
  Op_bitxor = 0xaa,
  Op_call = 0x41,
  Op_callmethod = 0x43,
  Op_callproperty = 0x46,
  Op_callproplex = 0x4c,
  Op_callpropvoid = 0x4f,
  Op_callstatic = 0x44,
  Op_callsuper = 0x45,
  Op_callsupervoid = 0x4e,
  Op_checkfilter = 0x78,
  Op_coerce = 0x80,
  Op_coerce_a = 0x82,
  Op_coerce_s = 0x85,
  Op_construct = 0x42,
  Op_contructprop = 0x4a,
  Op_constructsuper = 0x49,
  Op_convert_b = 0x76,
  Op_convert_i = 0x73,
  Op_convert_d = 0x75,
  Op_convert_o = 0x77,
  Op_convert_u = 0x74,
  Op_convert_s = 0x70,
  Op_debug = 0xef,
  Op_debugfile = 0xf1,
  Op_debugline = 0xf0,
  Op_declocal = 0x94,
  Op_declocal_i = 0xc3,
  Op_decrement = 0x93,
  Op_decrement_i = 0xc1,
  Op_deleteproperty = 0x6a,
  Op_divide = 0xa3,
  Op_dup = 0x2a,
  Op_dxns = 0x06,
  Op_dxnslate = 0x07,
  Op_equals = 0xab,
  Op_esc_xattr = 0x72,
  Op_esc_xelem = 0x71,
  Op_findproperty = 0x5e,
  Op_findpropstrict = 0x5d,
  Op_getdescendants = 0x59,
  Op_getglobalscope = 0x64,
  Op_getglobalslot = 0x6e,
  Op_getlex = 0x60,
  Op_getlocal = 0x62,
  Op_getlocal_0 = 0xd0,
  Op_getlocal_1 = 0xd1,
  Op_getlocal_2 = 0xd2,
  Op_getlocal_3 = 0xd3,
  Op_getproperty = 0x66,
  Op_getscopeobject = 0x65,
  Op_getslot = 0x6c,
  Op_getsuper = 0x04,
  Op_greaterequals = 0xb0,
  Op_greaterthan = 0xaf,
  Op_hasnext = 0x1f,
  Op_hasnext2 = 0x32,
  Op_ifeq = 0x13,
  Op_iffalse = 0x12,
  Op_ifge = 0x18,
  Op_ifgt = 0x17,
  Op_ifle = 0x16,
  Op_iflt = 0x15,
  Op_ifnge = 0x0f,
  Op_ifngt = 0x0e,
  Op_ifnle = 0x0d,
  Op_ifnlt = 0x0c,
  Op_ifne = 0x14,
  Op_ifstricteq = 0x19,
  Op_ifstrictne = 0x1a,
  Op_iftrue = 0x11,
  Op_in = 0xb4,
  Op_inclocal = 0x92,
  Op_inclocal_i = 0xc2,
  Op_increment = 0x91,
  Op_increment_i = 0xc0,
  Op_initproperty = 0x68,
  Op_instanceof = 0xb1,
  Op_istype = 0xb2,
  Op_istypelate = 0xb3,
  Op_jump = 0x10,
  Op_kill = 0x08,
  Op_label = 0x09,
  Op_lessequals = 0xae,
  Op_lessthan = 0xad,
  Op_lookupswitch = 0x1b,
  Op_lshift = 0xa5,
  Op_modulo = 0xa4,
  Op_multiply = 0xa2,
  Op_multiply_i = 0xc7,
  Op_negate = 0x90,
  Op_negate_i = 0xc4,
  Op_newactivation = 0x57,
  Op_newarray = 0x56,
  Op_newcatch = 0x5a,
  Op_newclass = 0x58,
  Op_newfunction = 0x40,
  Op_newobject = 0x55,
  Op_nextname = 0x1e,
  Op_nextvalue = 0x23,
  Op_nop = 0x02,
  Op_not = 0x96,
  Op_pop = 0x29,
  Op_popscope = 0x1d,
  Op_pushbyte = 0x24,
  Op_pushdouble = 0x2f,
  Op_pushfalse = 0x27,
  Op_pushint = 0x2d,
  Op_pushnamespace = 0x31,
  Op_pushnan = 0x28,
  Op_pushnull = 0x20,
  Op_pushscope = 0x30,
  Op_pushshort = 0x25,
  Op_pushstring = 0x2c,
  Op_pushtrue = 0x26,
  Op_pushuint = 0x2e,
  Op_undefined = 0x21,
  Op_pushwith = 0x1c,
  Op_returnvalue = 0x48,
  Op_returnvoid = 0x47,
  Op_rshift = 0xa6,
  Op_setlocal = 0x63,
  Op_setlocal_0 = 0xd4,
  Op_setlocal_1 = 0xd5,
  Op_setlocal_2 = 0xd6,
  Op_setlocal_3 = 0xd7,
  Op_setglobalslot = 0x6f,
  Op_setproperty = 0x61,
  Op_setslot = 0x6d,
  Op_setsuper = 0x05,
  Op_strictequals = 0xac,
  Op_subtract = 0xa1,
  Op_subtract_i = 0xc6,
  Op_swap = 0x2b,
  Op_throw = 0x03,
  Op_typeof = 0x95,
  Op_urshift = 0xa7,
}

export interface IInstruction {
  code: InstructionCode;
}

export interface IAddInstr extends IInstruction {
  code: InstructionCode.Op_add;
}

export interface IAddIInstr extends IInstruction {
  code: InstructionCode.Op_add_i;
}

export interface IAstypeInstr extends IInstruction {
  code: InstructionCode.Op_astype;
  operand0: number;
}

export interface IAstypelateInstr extends IInstruction {
  code: InstructionCode.Op_astypelate;
}

export interface IBitandInstr extends IInstruction {
  code: InstructionCode.Op_bitand;
}

export interface IBitnotInstr extends IInstruction {
  code: InstructionCode.Op_bitnot;
}

export interface IBitorInstr extends IInstruction {
  code: InstructionCode.Op_bitor;
}

export interface IBitxorInstr extends IInstruction {
  code: InstructionCode.Op_bitxor;
}

export interface ICallInstr extends IInstruction {
  code: InstructionCode.Op_call;
  operand0: number;
}

export interface ICallmethodInstr extends IInstruction {
  code: InstructionCode.Op_callmethod;
  operand0: number;
  operand1: number;
}

export interface ICallpropertyInstr extends IInstruction {
  code: InstructionCode.Op_callproperty;
  operand0: number;
  operand1: number;
}

export interface ICallproplexInstr extends IInstruction {
  code: InstructionCode.Op_callproplex;
  operand0: number;
  operand1: number;
}

export interface ICallpropvoidInstr extends IInstruction {
  code: InstructionCode.Op_callpropvoid;
  operand0: number;
  operand1: number;
}

export interface ICallstaticInstr extends IInstruction {
  code: InstructionCode.Op_callstatic;
  operand0: number;
  operand1: number;
}

export interface ICallsuperInstr extends IInstruction {
  code: InstructionCode.Op_callsuper;
  operand0: number;
  operand1: number;
}

export interface ICallsupervoidInstr extends IInstruction {
  code: InstructionCode.Op_callsupervoid;
  operand0: number;
  operand1: number;
}

export interface ICheckfilterInstr extends IInstruction {
  code: InstructionCode.Op_checkfilter;
}

export interface ICoerceInstr extends IInstruction {
  code: InstructionCode.Op_coerce;
  operand0: number;
}

export interface ICoerceAInstr extends IInstruction {
  code: InstructionCode.Op_coerce_a;
}

export interface ICoerceSInstr extends IInstruction {
  code: InstructionCode.Op_coerce_s;
}

export interface IConstructInstr extends IInstruction {
  code: InstructionCode.Op_construct;
  operand0: number;
}

export interface IContructpropInstr extends IInstruction {
  code: InstructionCode.Op_contructprop;
  operand0: number;
  operand1: number;
}

export interface IConstructsuperInstr extends IInstruction {
  code: InstructionCode.Op_constructsuper;
  operand0: number;
}

export interface IConvertBInstr extends IInstruction {
  code: InstructionCode.Op_convert_b;
}

export interface IConvertIInstr extends IInstruction {
  code: InstructionCode.Op_convert_i;
}

export interface IConvertDInstr extends IInstruction {
  code: InstructionCode.Op_convert_d;
}

export interface IConvertOInstr extends IInstruction {
  code: InstructionCode.Op_convert_o;
}

export interface IConvertUInstr extends IInstruction {
  code: InstructionCode.Op_convert_u;
}

export interface IConvertSInstr extends IInstruction {
  code: InstructionCode.Op_convert_s;
}

export interface IDebugInstr extends IInstruction {
  code: InstructionCode.Op_debug;
  operand0: number;
  operand1: number;
  operand2: number;
  operand3: number;
}

export interface IDebugfileInstr extends IInstruction {
  code: InstructionCode.Op_debugfile;
  operand0: number;
}

export interface IDebuglineInstr extends IInstruction {
  code: InstructionCode.Op_debugline;
  operand0: number;
}

export interface IDeclocalInstr extends IInstruction {
  code: InstructionCode.Op_declocal;
  operand0: number;
}

export interface IDeclocalIInstr extends IInstruction {
  code: InstructionCode.Op_declocal_i;
  operand0: number;
}

export interface IDecrementInstr extends IInstruction {
  code: InstructionCode.Op_decrement;
}

export interface IDecrementIInstr extends IInstruction {
  code: InstructionCode.Op_decrement_i;
}

export interface IDeletepropertyInstr extends IInstruction {
  code: InstructionCode.Op_deleteproperty;
  operand0: number;
}

export interface IDivideInstr extends IInstruction {
  code: InstructionCode.Op_divide;
}

export interface IDupInstr extends IInstruction {
  code: InstructionCode.Op_dup;
}

export interface IDxnsInstr extends IInstruction {
  code: InstructionCode.Op_dxns;
  operand0: number;
}

export interface IDxnslateInstr extends IInstruction {
  code: InstructionCode.Op_dxnslate;
}

export interface IEqualsInstr extends IInstruction {
  code: InstructionCode.Op_equals;
}

export interface IEscXattrInstr extends IInstruction {
  code: InstructionCode.Op_esc_xattr;
}

export interface IEscXelemInstr extends IInstruction {
  code: InstructionCode.Op_esc_xelem;
}

export interface IFindpropertyInstr extends IInstruction {
  code: InstructionCode.Op_findproperty;
  operand0: number;
}

export interface IFindpropstrictInstr extends IInstruction {
  code: InstructionCode.Op_findpropstrict;
  operand0: number;
}

export interface IGetdescendantsInstr extends IInstruction {
  code: InstructionCode.Op_getdescendants;
  operand0: number;
}

export interface IGetglobalscopeInstr extends IInstruction {
  code: InstructionCode.Op_getglobalscope;
}

export interface IGetglobalslotInstr extends IInstruction {
  code: InstructionCode.Op_getglobalslot;
  operand0: number;
}

export interface IGetlexInstr extends IInstruction {
  code: InstructionCode.Op_getlex;
  operand0: number;
}

export interface IGetlocalInstr extends IInstruction {
  code: InstructionCode.Op_getlocal;
  operand0: number;
}

export interface IGetlocal0Instr extends IInstruction {
  code: InstructionCode.Op_getlocal_0;
}

export interface IGetlocal1Instr extends IInstruction {
  code: InstructionCode.Op_getlocal_1;
}

export interface IGetlocal2Instr extends IInstruction {
  code: InstructionCode.Op_getlocal_2;
}

export interface IGetlocal3Instr extends IInstruction {
  code: InstructionCode.Op_getlocal_3;
}

export interface IGetpropertyInstr extends IInstruction {
  code: InstructionCode.Op_getproperty;
  operand0: number;
}

export interface IGetscopeobjectInstr extends IInstruction {
  code: InstructionCode.Op_getscopeobject;
  operand0: number;
}

export interface IGetslotInstr extends IInstruction {
  code: InstructionCode.Op_getslot;
  operand0: number;
}

export interface IGetsuperInstr extends IInstruction {
  code: InstructionCode.Op_getsuper;
  operand0: number;
}

export interface IGreaterequalsInstr extends IInstruction {
  code: InstructionCode.Op_greaterequals;
}

export interface IGreaterthanInstr extends IInstruction {
  code: InstructionCode.Op_greaterthan;
}

export interface IHasnextInstr extends IInstruction {
  code: InstructionCode.Op_hasnext;
}

export interface IHasnext2Instr extends IInstruction {
  code: InstructionCode.Op_hasnext2;
  operand0: number;
  operand1: number;
}

export interface IIfeqInstr extends IInstruction {
  code: InstructionCode.Op_ifeq;
  operand0: number;
}

export interface IIffalseInstr extends IInstruction {
  code: InstructionCode.Op_iffalse;
  operand0: number;
}

export interface IIfgeInstr extends IInstruction {
  code: InstructionCode.Op_ifge;
  operand0: number;
}

export interface IIfgtInstr extends IInstruction {
  code: InstructionCode.Op_ifgt;
  operand0: number;
}

export interface IIfleInstr extends IInstruction {
  code: InstructionCode.Op_ifle;
  operand0: number;
}

export interface IIfltInstr extends IInstruction {
  code: InstructionCode.Op_iflt;
  operand0: number;
}

export interface IIfngeInstr extends IInstruction {
  code: InstructionCode.Op_ifnge;
  operand0: number;
}

export interface IIfngtInstr extends IInstruction {
  code: InstructionCode.Op_ifngt;
  operand0: number;
}

export interface IIfnleInstr extends IInstruction {
  code: InstructionCode.Op_ifnle;
  operand0: number;
}

export interface IIfnltInstr extends IInstruction {
  code: InstructionCode.Op_ifnlt;
  operand0: number;
}

export interface IIfneInstr extends IInstruction {
  code: InstructionCode.Op_ifne;
  operand0: number;
}

export interface IIfstricteqInstr extends IInstruction {
  code: InstructionCode.Op_ifstricteq;
  operand0: number;
}

export interface IIfstrictneInstr extends IInstruction {
  code: InstructionCode.Op_ifstrictne;
  operand0: number;
}

export interface IIftrueInstr extends IInstruction {
  code: InstructionCode.Op_iftrue;
  operand0: number;
}

export interface IInInstr extends IInstruction {
  code: InstructionCode.Op_in;
}

export interface IInclocalInstr extends IInstruction {
  code: InstructionCode.Op_inclocal;
  operand0: number;
}

export interface IInclocalIInstr extends IInstruction {
  code: InstructionCode.Op_inclocal_i;
  operand0: number;
}

export interface IIncrementInstr extends IInstruction {
  code: InstructionCode.Op_increment;
}

export interface IIncrementIInstr extends IInstruction {
  code: InstructionCode.Op_increment_i;
}

export interface IInitpropertyInstr extends IInstruction {
  code: InstructionCode.Op_initproperty;
  operand0: number;
}

export interface IInstanceofInstr extends IInstruction {
  code: InstructionCode.Op_instanceof;
}

export interface IIstypeInstr extends IInstruction {
  code: InstructionCode.Op_istype;
  operand0: number;
}

export interface IIstypelateInstr extends IInstruction {
  code: InstructionCode.Op_istypelate;
}

export interface IJumpInstr extends IInstruction {
  code: InstructionCode.Op_jump;
  operand0: number;
}

export interface IKillInstr extends IInstruction {
  code: InstructionCode.Op_kill;
  operand0: number;
}

export interface ILabelInstr extends IInstruction {
  code: InstructionCode.Op_label;
}

export interface ILessequalsInstr extends IInstruction {
  code: InstructionCode.Op_lessequals;
}

export interface ILessthanInstr extends IInstruction {
  code: InstructionCode.Op_lessthan;
}

export interface ILookupswitchInstr extends IInstruction {
  code: InstructionCode.Op_lookupswitch;
  operand0: number;
  cases: number[];
}

export interface ILshiftInstr extends IInstruction {
  code: InstructionCode.Op_lshift;
}

export interface IModuloInstr extends IInstruction {
  code: InstructionCode.Op_modulo;
}

export interface IMultiplyInstr extends IInstruction {
  code: InstructionCode.Op_multiply;
}

export interface IMultiplyIInstr extends IInstruction {
  code: InstructionCode.Op_multiply_i;
}

export interface INegateInstr extends IInstruction {
  code: InstructionCode.Op_negate;
}

export interface INegateIInstr extends IInstruction {
  code: InstructionCode.Op_negate_i;
}

export interface INewactivationInstr extends IInstruction {
  code: InstructionCode.Op_newactivation;
}

export interface INewarrayInstr extends IInstruction {
  code: InstructionCode.Op_newarray;
  operand0: number;
}

export interface INewcatchInstr extends IInstruction {
  code: InstructionCode.Op_newcatch;
  operand0: number;
}

export interface INewclassInstr extends IInstruction {
  code: InstructionCode.Op_newclass;
  operand0: number;
}

export interface INewfunctionInstr extends IInstruction {
  code: InstructionCode.Op_newfunction;
  operand0: number;
}

export interface INewobjectInstr extends IInstruction {
  code: InstructionCode.Op_newobject;
  operand0: number;
}

export interface INextnameInstr extends IInstruction {
  code: InstructionCode.Op_nextname;
}

export interface INextvalueInstr extends IInstruction {
  code: InstructionCode.Op_nextvalue;
}

export interface INopInstr extends IInstruction {
  code: InstructionCode.Op_nop;
}

export interface INotInstr extends IInstruction {
  code: InstructionCode.Op_not;
}

export interface IPopInstr extends IInstruction {
  code: InstructionCode.Op_pop;
}

export interface IPopscopeInstr extends IInstruction {
  code: InstructionCode.Op_popscope;
}

export interface IPushbyteInstr extends IInstruction {
  code: InstructionCode.Op_pushbyte;
  operand0: number;
}

export interface IPushdoubleInstr extends IInstruction {
  code: InstructionCode.Op_pushdouble;
  operand0: number;
}

export interface IPushfalseInstr extends IInstruction {
  code: InstructionCode.Op_pushfalse;
}

export interface IPushintInstr extends IInstruction {
  code: InstructionCode.Op_pushint;
  operand0: number;
}

export interface IPushnamespaceInstr extends IInstruction {
  code: InstructionCode.Op_pushnamespace;
  operand0: number;
}

export interface IPushnanInstr extends IInstruction {
  code: InstructionCode.Op_pushnan;
}

export interface IPushnullInstr extends IInstruction {
  code: InstructionCode.Op_pushnull;
}

export interface IPushscopeInstr extends IInstruction {
  code: InstructionCode.Op_pushscope;
}

export interface IPushshortInstr extends IInstruction {
  code: InstructionCode.Op_pushshort;
  operand0: number;
}

export interface IPushstringInstr extends IInstruction {
  code: InstructionCode.Op_pushstring;
  operand0: number;
}

export interface IPushtrueInstr extends IInstruction {
  code: InstructionCode.Op_pushtrue;
}

export interface IPushuintInstr extends IInstruction {
  code: InstructionCode.Op_pushuint;
  operand0: number;
}

export interface IUndefinedInstr extends IInstruction {
  code: InstructionCode.Op_undefined;
}

export interface IPushwithInstr extends IInstruction {
  code: InstructionCode.Op_pushwith;
}

export interface IReturnvalueInstr extends IInstruction {
  code: InstructionCode.Op_returnvalue;
}

export interface IReturnvoidInstr extends IInstruction {
  code: InstructionCode.Op_returnvoid;
}

export interface IRshiftInstr extends IInstruction {
  code: InstructionCode.Op_rshift;
}

export interface ISetlocalInstr extends IInstruction {
  code: InstructionCode.Op_setlocal;
  operand0: number;
}

export interface ISetlocal0Instr extends IInstruction {
  code: InstructionCode.Op_setlocal_0;
}

export interface ISetlocal1Instr extends IInstruction {
  code: InstructionCode.Op_setlocal_1;
}

export interface ISetlocal2Instr extends IInstruction {
  code: InstructionCode.Op_setlocal_2;
}

export interface ISetlocal3Instr extends IInstruction {
  code: InstructionCode.Op_setlocal_3;
}

export interface ISetglobalslotInstr extends IInstruction {
  code: InstructionCode.Op_setglobalslot;
  operand0: number;
}

export interface ISetpropertyInstr extends IInstruction {
  code: InstructionCode.Op_setproperty;
  operand0: number;
}

export interface ISetslotInstr extends IInstruction {
  code: InstructionCode.Op_setslot;
  operand0: number;
}

export interface ISetsuperInstr extends IInstruction {
  code: InstructionCode.Op_setsuper;
  operand0: number;
}

export interface IStrictequalsInstr extends IInstruction {
  code: InstructionCode.Op_strictequals;
}

export interface ISubtractInstr extends IInstruction {
  code: InstructionCode.Op_subtract;
}

export interface ISubtractIInstr extends IInstruction {
  code: InstructionCode.Op_subtract_i;
}

export interface ISwapInstr extends IInstruction {
  code: InstructionCode.Op_swap;
}

export interface IThrowInstr extends IInstruction {
  code: InstructionCode.Op_throw;
}

export interface ITypeofInstr extends IInstruction {
  code: InstructionCode.Op_typeof;
}

export interface IUrshiftInstr extends IInstruction {
  code: InstructionCode.Op_urshift;
}

export type Instruction =
  IAddInstr |
  IAddIInstr |
  IAstypeInstr |
  IAstypelateInstr |
  IBitandInstr |
  IBitnotInstr |
  IBitorInstr |
  IBitxorInstr |
  ICallInstr |
  ICallmethodInstr |
  ICallpropertyInstr |
  ICallproplexInstr |
  ICallpropvoidInstr |
  ICallstaticInstr |
  ICallsuperInstr |
  ICallsupervoidInstr |
  ICheckfilterInstr |
  ICoerceInstr |
  ICoerceAInstr |
  ICoerceSInstr |
  IConstructInstr |
  IContructpropInstr |
  IConstructsuperInstr |
  IConvertBInstr |
  IConvertIInstr |
  IConvertDInstr |
  IConvertOInstr |
  IConvertUInstr |
  IConvertSInstr |
  IDebugInstr |
  IDebugfileInstr |
  IDebuglineInstr |
  IDeclocalInstr |
  IDeclocalIInstr |
  IDecrementInstr |
  IDecrementIInstr |
  IDeletepropertyInstr |
  IDivideInstr |
  IDupInstr |
  IDxnsInstr |
  IDxnslateInstr |
  IEqualsInstr |
  IEscXattrInstr |
  IEscXelemInstr |
  IFindpropertyInstr |
  IFindpropstrictInstr |
  IGetdescendantsInstr |
  IGetglobalscopeInstr |
  IGetglobalslotInstr |
  IGetlexInstr |
  IGetlocalInstr |
  IGetlocal0Instr |
  IGetlocal1Instr |
  IGetlocal2Instr |
  IGetlocal3Instr |
  IGetpropertyInstr |
  IGetscopeobjectInstr |
  IGetslotInstr |
  IGetsuperInstr |
  IGreaterequalsInstr |
  IGreaterthanInstr |
  IHasnextInstr |
  IHasnext2Instr |
  IIfeqInstr |
  IIffalseInstr |
  IIfgeInstr |
  IIfgtInstr |
  IIfleInstr |
  IIfltInstr |
  IIfngeInstr |
  IIfngtInstr |
  IIfnleInstr |
  IIfnltInstr |
  IIfneInstr |
  IIfstricteqInstr |
  IIfstrictneInstr |
  IIftrueInstr |
  IInInstr |
  IInclocalInstr |
  IInclocalIInstr |
  IIncrementInstr |
  IIncrementIInstr |
  IInitpropertyInstr |
  IInstanceofInstr |
  IIstypeInstr |
  IIstypelateInstr |
  IJumpInstr |
  IKillInstr |
  ILabelInstr |
  ILessequalsInstr |
  ILessthanInstr |
  ILookupswitchInstr |
  ILshiftInstr |
  IModuloInstr |
  IMultiplyInstr |
  IMultiplyIInstr |
  INegateInstr |
  INegateIInstr |
  INewactivationInstr |
  INewarrayInstr |
  INewcatchInstr |
  INewclassInstr |
  INewfunctionInstr |
  INewobjectInstr |
  INextnameInstr |
  INextvalueInstr |
  INopInstr |
  INotInstr |
  IPopInstr |
  IPopscopeInstr |
  IPushbyteInstr |
  IPushdoubleInstr |
  IPushfalseInstr |
  IPushintInstr |
  IPushnamespaceInstr |
  IPushnanInstr |
  IPushnullInstr |
  IPushscopeInstr |
  IPushshortInstr |
  IPushstringInstr |
  IPushtrueInstr |
  IPushuintInstr |
  IUndefinedInstr |
  IPushwithInstr |
  IReturnvalueInstr |
  IReturnvoidInstr |
  IRshiftInstr |
  ISetlocalInstr |
  ISetlocal0Instr |
  ISetlocal1Instr |
  ISetlocal2Instr |
  ISetlocal3Instr |
  ISetglobalslotInstr |
  ISetpropertyInstr |
  ISetslotInstr |
  ISetsuperInstr |
  IStrictequalsInstr |
  ISubtractInstr |
  ISubtractIInstr |
  ISwapInstr |
  IThrowInstr |
  ITypeofInstr |
  IUrshiftInstr;
