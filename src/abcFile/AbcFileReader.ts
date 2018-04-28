import SmarterBuffer from './../SmarterBuffer';
import { IAbcFile, IConstantPool, IMetadataInfo } from './types';
import { Instruction, InstructionCode } from './types/bytecode';
import { IClassInfo } from './types/classes';
import { Constant, ConstantKind } from './types/constant';
import { IInstanceInfo, InstanceInfoFlag } from './types/instance';
import { IException, IMethodBody, IMethodInfo, MethodInfoFlag } from './types/methods';
import { IMultiname, IMultinameL, IQName, IRTQName, IRTQNameL, MultinameInfo, MultinameKind } from './types/multiname';
import { INamespaceInfo, INamespaceSetInfo, NamespaceKind } from './types/namespace';
import { IScriptInfo } from './types/scripts';
import { ITrait, Trait, TraitKind } from './types/trait';
/**
 * Spec: https://wwwimages2.adobe.com/content/dam/acom/en/devnet/pdf/avm2overview.pdf
 * Page 18 onwards
 */
export default class AbcFileReader {
  private buffer: SmarterBuffer;

  constructor(buffer: SmarterBuffer) {
    this.buffer = buffer;
  }

  public readFile(): IAbcFile {
    const minorVersion = this.buffer.readUInt16LE();
    const majorVersion = this.buffer.readUInt16LE();
    const constantPool = this.readConstantPool();
    const methodCount = this.buffer.readEncodedU30();
    const methods = this.readMethods(methodCount, constantPool);
    const metadataCount = this.buffer.readEncodedU30();
    const metadataInfos = this.readMetadataInfos(metadataCount, constantPool);
    const classCount = this.buffer.readEncodedU30();
    const classes: IClassInfo[] = [];
    const instances = this.readInstances(classCount, constantPool, methods, classes);
    for (let i = 0; i < classCount; i++) {
      classes.push(this.readClass(i, constantPool, methods, classes, instances));
    }
    const scriptCount = this.buffer.readEncodedU30();
    const scripts: IScriptInfo[] = [];
    for (let i = 0; i < scriptCount; i++) {
      scripts.push(this.readScript(constantPool, methods, classes));
    }
    const methodBodyCount = this.buffer.readEncodedU30();
    const methodBodies = this.readMethodBodies(methodBodyCount, methods, constantPool, classes);

    return {
      minorVersion,
      majorVersion,
      constantPool,
      methodCount,
      methods,
      metadataCount,
      metadataInfos,
      classCount,
      instances,
      classes,
      scriptCount,
      scripts,
      methodBodyCount,
      methodBodies,
    };
  }

  private readConstantPool(): IConstantPool {
    const intCount = this.buffer.readEncodedU30();
    const integers = [0];
    for (let i = 1; i < intCount; i++) {
      integers.push(this.buffer.readEncodedU32());
    }

    const uintCount = this.buffer.readEncodedU30();
    const uintegers = [0];
    for (let i = 1; i < uintCount; i++) {
      uintegers.push(this.buffer.readEncodedU32());
    }

    const doubleCount = this.buffer.readEncodedU30();
    const doubles = [NaN];
    for (let i = 1; i < doubleCount; i++) {
      doubles.push(this.buffer.readDoubleLE());
    }

    const stringCount = this.buffer.readEncodedU30();
    const strings = ['*'];
    for (let i = 1; i < stringCount; i++) {
      const size = this.buffer.readEncodedU30();
      strings.push(this.buffer.readBuffer(size).toString('utf8'));
    }

    const namespaceCount = this.buffer.readEncodedU30();
    const namespaces: INamespaceInfo[] = [null];
    for (let i = 1; i < namespaceCount; i++) {
      const kind: NamespaceKind = this.buffer.readUInt8();
      const name = this.buffer.readEncodedU30();
      namespaces.push({
        kind,
        get name() {
          return strings[name];
        },
      });
    }

    const nsSetCount = this.buffer.readEncodedU30();
    const nsSet: INamespaceSetInfo[] = [null];
    for (let i = 1; i < nsSetCount; i++) {
      const count = this.buffer.readEncodedU30();
      const nsArray: INamespaceInfo[] = [];
      for (let x = 0; x < count; x++) {
        const ref = this.buffer.readEncodedU30();
        nsArray.push(namespaces[ref]);
      }
      nsSet.push({ count, namespaces: nsArray });
    }

    const multinameCount = this.buffer.readEncodedU30();
    const multinames: MultinameInfo[] = [null];
    for (let i = 1; i < multinameCount; i++) {
      const kind: MultinameKind = this.buffer.readUInt8();
      switch (kind) {
        case MultinameKind.QName:
        case MultinameKind.QNameA:
          const ns = this.buffer.readEncodedU30();
          const name = this.buffer.readEncodedU30();
          const qname: IQName = {
            kind,
            get ns() {
              return namespaces[ns];
            },
            get name() {
              return strings[name];
            },
          };
          multinames.push(qname);
          break;
        case MultinameKind.RTQName:
        case MultinameKind.RTQNameA:
          const name2 = this.buffer.readEncodedU30();
          const rtqname: IRTQName = {
            kind,
            get name() {
              return strings[name2];
            },
          };
          multinames.push(rtqname);
          break;
        case MultinameKind.RTQNAmeL:
        case MultinameKind.RTQNameLA:
          const rtqnamel: IRTQNameL = { kind };
          multinames.push(rtqnamel);
          break;
        case MultinameKind.Multiname:
        case MultinameKind.MultinameA:
          const name3 = this.buffer.readEncodedU30();
          const nsSetIndex = this.buffer.readEncodedU30();
          const multiname: IMultiname = {
            kind,
            get name() {
              return strings[name3];
            },
            get nsSet() {
              return nsSet[nsSetIndex];
            },
          };
          multinames.push(multiname);
          break;
        case MultinameKind.MultinameL:
        case MultinameKind.MultinameLA:
          const nsSetIndex2 = this.buffer.readEncodedU30();
          const multinamel: IMultinameL = {
            kind,
            get nsSet() {
              return nsSet[nsSetIndex2];
            },
          };
          multinames.push(multinamel);
          break;
        case MultinameKind.TypeName:
          const nameIndex1 = this.buffer.readEncodedU30();
          const paramsCount = this.buffer.readEncodedU30();
          for (let j = 0; j < paramsCount; j++) {
            this.buffer.readEncodedU30();
          }
          multinames.push(null);
          break;
        default:
          multinames.push(null);
          break;
      }
    }

    return {
      intCount,
      integers,
      uintCount,
      uintegers,
      doubleCount,
      doubles,
      stringCount,
      strings,
      namespaceCount,
      namespaces,
      nsSetCount,
      nsSet,
      multinameCount,
      multinames,
    };
  }

  private buildConstant(kind: ConstantKind, valueIndex: number, constantPool: IConstantPool): Constant {
    switch (kind) {
      case ConstantKind.Int:
        return {
          kind,
          get val() {
            return constantPool.integers[valueIndex];
          },
        };
      case ConstantKind.UInt:
        return {
          kind,
          get val() {
            return constantPool.uintegers[valueIndex];
          },
        };
      case ConstantKind.Double:
        return {
          kind,
          get val() {
            return constantPool.doubles[valueIndex];
          },
        };
      case ConstantKind.Utf8:
        return {
          kind,
          get val() {
            return constantPool.strings[valueIndex];
          },
        };
      case ConstantKind.PackageNamespace:
      case ConstantKind.Namespace:
      case ConstantKind.PackageInternalNs:
      case ConstantKind.ProtectedNamespace:
      case ConstantKind.ExplicitNamespace:
      case ConstantKind.StaticProtectedNs:
      case ConstantKind.PrivateNs:
        return {
          kind,
          get val() {
            return constantPool.namespaces[valueIndex];
          },
        };
      case ConstantKind.True:
        return {
          kind,
          get val(): true {
            return true;
          },
        };
      case ConstantKind.False:
        return {
          kind,
          get val(): false {
            return false;
          },
        };
      case ConstantKind.Null:
        return {
          kind,
          get val(): null {
            return null;
          },
        };
      case ConstantKind.Undefined:
        return {
          kind,
          get val(): null {
            return undefined;
          },
        };
    }
  }

  private readMethods(methodCount: number, constantPool: IConstantPool): IMethodInfo[] {
    const methods: IMethodInfo[] = [];
    for (let i = 0; i < methodCount; i++) {
      const paramCount = this.buffer.readEncodedU30();
      const returnTypeIndex = this.buffer.readEncodedU30();
      const paramTypes: MultinameInfo[] = [];
      for (let y = 0; y < paramCount; y++) {
        paramTypes.push(constantPool.multinames[this.buffer.readEncodedU30()]);
      }

      const nameIndex = this.buffer.readEncodedU30();
      const flags = this.buffer.readUInt8();

      const method: IMethodInfo = {
        paramCount,
        get returnType() {
          return constantPool.multinames[returnTypeIndex];
        },
        paramTypes,
        get name() {
          return constantPool.strings[nameIndex];
        },
        flags,
      };

      if (flags & MethodInfoFlag.HasOptional) {
        const count = this.buffer.readEncodedU30();
        const options: Constant[] = [];
        for (let x = 0; x < count; x++) {
          const valIndex = this.buffer.readEncodedU30();
          const kind: ConstantKind = this.buffer.readUInt8();
          options.push(this.buildConstant(kind, valIndex, constantPool));
        }
        method.options = { count, options };
      }

      if (flags & MethodInfoFlag.HasParamNames) {

        const names: string[] = [];
        for (let y = 0; y < paramCount; y++) {
          const index = this.buffer.readEncodedU30();
          names.push(constantPool.strings[index]);
        }
        method.paramNames = { names };
      }

      methods.push(method);
    }

    return methods;
  }

  private readMetadataInfos(metadataCount: number, constantPool: IConstantPool): IMetadataInfo[] {
    const metadatas: IMetadataInfo[] = [];
    for (let i = 0; i < metadataCount; i++) {
      const nameIndex = this.buffer.readEncodedU30();
      const itemCount = this.buffer.readEncodedU30();
      const keys: string[] = [];
      for (let z = 0; z < itemCount; z++) {
        keys.push(constantPool.strings[this.buffer.readEncodedU30()]);
      }
      const values: string[] = [];
      for (let j = 0; j < itemCount; j++) {
        values.push(constantPool.strings[this.buffer.readEncodedU30()]);
      }
      metadatas.push({
        get name() {
          return constantPool.strings[nameIndex];
        },
        itemCount,
        keys,
        values,
      });
    }
    return metadatas;
  }

  private readTrait(constantPool: IConstantPool, methods: IMethodInfo[], classes: IClassInfo[]): Trait {
    const nameIndex2 = this.buffer.readEncodedU30();
    const kindAndAttrs = this.buffer.readUInt8();
    // lower four bits
    const kind: TraitKind = kindAndAttrs & 15;
    // upper four bits
    const attrs = kindAndAttrs >> 4;

    let trait: Trait;
    switch (kind) {
      case TraitKind.Slot:
      case TraitKind.Const: {
        const slotId = this.buffer.readEncodedU30();
        const typeNameIndex = this.buffer.readEncodedU30();
        const vindex = this.buffer.readEncodedU30();
        let vkind: ConstantKind;
        if (vindex > 0) {
          vkind = this.buffer.readUInt8();
        }
        trait = {
          get name() {
            return constantPool.multinames[nameIndex2];
          },
          kind,
          slotId,
          get typeName() {
            return constantPool.multinames[typeNameIndex];
          },
          value: vindex > 0 ? this.buildConstant(vkind, vindex, constantPool) : undefined,
        };
        break;
      }
      case TraitKind.Class: {
        const slotId = this.buffer.readEncodedU30();
        const classi = this.buffer.readEncodedU30();
        trait = {
          get name() {
            return constantPool.multinames[nameIndex2];
          },
          kind,
          get class() {
            return classes[classi];
          },
        };
        break;
      }
      case TraitKind.Function: {
        const slotId = this.buffer.readEncodedU30();
        const functionIndex = this.buffer.readEncodedU30();
        trait = {
          get name() {
            return constantPool.multinames[nameIndex2];
          },
          kind,
          slotId,
          get func() {
            return methods[methodIndex];
          },
        };
        break;
      }
      case TraitKind.Method:
      case TraitKind.Getter:
      case TraitKind.Setter:
        const dispId = this.buffer.readEncodedU30();
        const methodIndex = this.buffer.readEncodedU30();
        trait = {
          dispId,
          get name() {
            return constantPool.multinames[nameIndex2];
          },
          kind,
          get method() {
            return methods[methodIndex];
          },
        };
        break;
    }

    if (attrs & 0x4) {
      const metadataCount = this.buffer.readEncodedU30();
      for (let j = 0; j < metadataCount; j++) {
        this.buffer.readEncodedU30();
      }
    }

    return trait;
  }

  private readClass(index: number, constantPool: IConstantPool, methods: IMethodInfo[], classes: IClassInfo[],
                    instances: IInstanceInfo[]): IClassInfo {
    const cinitIndex = this.buffer.readEncodedU30();
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let i = 0; i < traitCount; i++) {
      traits.push(this.readTrait(constantPool, methods, classes));
    }
    return {
      get instance() {
        return instances[index];
      },
      get cinit() {
        return methods[cinitIndex];
      },
      traitCount,
      traits,
    };
  }

  private readScript(constantPool: IConstantPool, methods: IMethodInfo[], classes: IClassInfo[]): IScriptInfo {
    const initIndex = this.buffer.readEncodedU30();
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let i = 0; i < traitCount; i++) {
      traits.push(this.readTrait(constantPool, methods, classes));
    }
    return {
      get init() {
        return methods[initIndex];
      },
      traitCount,
      traits,
    };
  }

  private readInstances(classCount: number, constantPool: IConstantPool, methods: IMethodInfo[],
                        classes: IClassInfo[]): IInstanceInfo[] {
    const instances: IInstanceInfo[] = [];
    for (let i = 0; i < classCount; i++) {
      const nameIndex = this.buffer.readEncodedU30();
      const supernameIndex = this.buffer.readEncodedU30();
      const flags = this.buffer.readUInt8();

      let protectedNs: INamespaceInfo;

      if (flags & InstanceInfoFlag.ClassProtectedNs) {
        protectedNs = constantPool.namespaces[this.buffer.readEncodedU30()];
      }

      const interfaceCount = this.buffer.readEncodedU30();
      const interfaces: MultinameInfo[] = [];
      for (let z = 0; z < interfaceCount; z++) {
        interfaces.push(constantPool.multinames[this.buffer.readEncodedU30()]);
      }

      const iinitIndex = this.buffer.readEncodedU30();

      const traitCount = this.buffer.readEncodedU30();
      const traits: Trait[] = [];
      for (let x = 0; x < traitCount; x++) {
        traits.push(this.readTrait(constantPool, methods, classes));
      }

      instances.push({
        get class() {
          return classes[i];
        },
        get name() {
          return constantPool.multinames[nameIndex];
        },
        get supername() {
          return constantPool.multinames[supernameIndex];
        },
        flags,
        protectedNs,
        interfaceCount,
        interfaces,
        get iinit() {
          return methods[iinitIndex];
        },
        traitCount,
        traits,
      });
    }
    return instances;
  }

  private readExceptions(exceptionCount: number, multinames: MultinameInfo[]): IException[] {
    const exceptions: IException[] = [];
    for (let i = 0; i < exceptionCount; i++) {
      const from = this.buffer.readEncodedU30();
      const to = this.buffer.readEncodedU30();
      const target = this.buffer.readEncodedU30();
      const excTypeIndex = this.buffer.readEncodedU30();
      const varNameIndex = this.buffer.readEncodedU30();
      exceptions.push({
        from,
        to,
        target,
        get excType() {
          return multinames[excTypeIndex];
        },
        get varName() {
          return multinames[varNameIndex];
        },
      });
    }
    return exceptions;
  }

  private readMethodBodies(methodBodyCount: number, methods: IMethodInfo[],
                           constantPool: IConstantPool, classes: IClassInfo[]): IMethodBody[] {
    const methodBodies: IMethodBody[] = [];
    for (let i = 0; i < methodBodyCount; i++) {
      const methodIndex = this.buffer.readEncodedU30();
      const maxStack = this.buffer.readEncodedU30();
      const localCount = this.buffer.readEncodedU30();
      const initScopeDepth = this.buffer.readEncodedU30();
      const maxScopeDepth = this.buffer.readEncodedU30();
      const codeLength = this.buffer.readEncodedU30();
      const startOffset = this.buffer.readOffset;
      const code: Instruction[] = [];
      while (this.buffer.readOffset < startOffset + codeLength) {
        code.push(this.readInstruction());
      }

      const exceptionCount = this.buffer.readEncodedU30();
      const exceptions = this.readExceptions(exceptionCount, constantPool.multinames);
      const traitCount = this.buffer.readEncodedU30();
      const traits: Trait[] = [];
      for (let y = 0; y < traitCount; y++) {
        traits.push(this.readTrait(constantPool, methods, classes));
      }

      methodBodies.push({
        get method() {
          return methods[methodIndex];
        },
        maxStack,
        localCount,
        initScopeDepth,
        maxScopeDepth,
        codeLength,
        code,
        exceptionCount,
        exceptions,
        traitCount,
        traits,
      });
    }
    return methodBodies;
  }

  private readInstruction(): Instruction {
    const code: InstructionCode = this.buffer.readUInt8();
    switch (code) {
      case InstructionCode.Op_add: {
        return { code };
      }
      case InstructionCode.Op_add_i: {
        return { code };
      }
      case InstructionCode.Op_astype: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_astypelate: {
        return { code };
      }
      case InstructionCode.Op_bitand: {
        return { code };
      }
      case InstructionCode.Op_bitnot: {
        return { code };
      }
      case InstructionCode.Op_bitor: {
        return { code };
      }
      case InstructionCode.Op_bitxor: {
        return { code };
      }
      case InstructionCode.Op_call: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_callmethod: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callproperty: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callproplex: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callpropvoid: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callstatic: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callsuper: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_callsupervoid: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_checkfilter: {
        return { code };
      }
      case InstructionCode.Op_coerce: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_coerce_a: {
        return { code };
      }
      case InstructionCode.Op_coerce_s: {
        return { code };
      }
      case InstructionCode.Op_construct: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_contructprop: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_constructsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_convert_b: {
        return { code };
      }
      case InstructionCode.Op_convert_i: {
        return { code };
      }
      case InstructionCode.Op_convert_d: {
        return { code };
      }
      case InstructionCode.Op_convert_o: {
        return { code };
      }
      case InstructionCode.Op_convert_u: {
        return { code };
      }
      case InstructionCode.Op_convert_s: {
        return { code };
      }
      case InstructionCode.Op_debug: {
        const operand0 = this.buffer.readUInt8();
        const operand1 = this.buffer.readEncodedU30();
        const operand2 = this.buffer.readUInt8();
        const operand3 = this.buffer.readEncodedU30();
        return { code, operand0, operand1, operand2, operand3 };
      }
      case InstructionCode.Op_debugfile: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_debugline: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_declocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_declocal_i: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_decrement: {
        return { code };
      }
      case InstructionCode.Op_decrement_i: {
        return { code };
      }
      case InstructionCode.Op_deleteproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_divide: {
        return { code };
      }
      case InstructionCode.Op_dup: {
        return { code };
      }
      case InstructionCode.Op_dxns: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_dxnslate: {
        return { code };
      }
      case InstructionCode.Op_equals: {
        return { code };
      }
      case InstructionCode.Op_esc_xattr: {
        return { code };
      }
      case InstructionCode.Op_esc_xelem: {
        return { code };
      }
      case InstructionCode.Op_findproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_findpropstrict: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getdescendants: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getglobalscope: {
        return { code };
      }
      case InstructionCode.Op_getglobalslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getlex: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getlocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getlocal_0: {
        return { code };
      }
      case InstructionCode.Op_getlocal_1: {
        return { code };
      }
      case InstructionCode.Op_getlocal_2: {
        return { code };
      }
      case InstructionCode.Op_getlocal_3: {
        return { code };
      }
      case InstructionCode.Op_getproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getscopeobject: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_getsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_greaterequals: {
        return { code };
      }
      case InstructionCode.Op_greaterthan: {
        return { code };
      }
      case InstructionCode.Op_hasnext: {
        return { code };
      }
      case InstructionCode.Op_hasnext2: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.Op_ifeq: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_iffalse: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifge: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifgt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifle: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_iflt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifnge: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifngt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifnle: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifnlt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifne: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifstricteq: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_ifstrictne: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_iftrue: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_in: {
        return { code };
      }
      case InstructionCode.Op_inclocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_inclocal_i: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_increment: {
        return { code };
      }
      case InstructionCode.Op_increment_i: {
        return { code };
      }
      case InstructionCode.Op_initproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_instanceof: {
        return { code };
      }
      case InstructionCode.Op_istype: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_istypelate: {
        return { code };
      }
      case InstructionCode.Op_jump: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.Op_kill: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_label: {
        return { code };
      }
      case InstructionCode.Op_lessequals: {
        return { code };
      }
      case InstructionCode.Op_lessthan: {
        return { code };
      }
      case InstructionCode.Op_lookupswitch: {
        const operand0 = this.buffer.readS24();
        const count = this.buffer.readEncodedU30();
        const cases = [];
        for (let i = 0; i < count + 1; i++) {
          cases.push(this.buffer.readS24());
        }
        return { code, operand0, cases };
      }
      case InstructionCode.Op_lshift: {
        return { code };
      }
      case InstructionCode.Op_modulo: {
        return { code };
      }
      case InstructionCode.Op_multiply: {
        return { code };
      }
      case InstructionCode.Op_multiply_i: {
        return { code };
      }
      case InstructionCode.Op_negate: {
        return { code };
      }
      case InstructionCode.Op_negate_i: {
        return { code };
      }
      case InstructionCode.Op_newactivation: {
        return { code };
      }
      case InstructionCode.Op_newarray: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_newcatch: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_newclass: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_newfunction: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_newobject: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_nextname: {
        return { code };
      }
      case InstructionCode.Op_nextvalue: {
        return { code };
      }
      case InstructionCode.Op_nop: {
        return { code };
      }
      case InstructionCode.Op_not: {
        return { code };
      }
      case InstructionCode.Op_pop: {
        return { code };
      }
      case InstructionCode.Op_popscope: {
        return { code };
      }
      case InstructionCode.Op_pushbyte: {
        const operand0 = this.buffer.readUInt8();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushdouble: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushfalse: {
        return { code };
      }
      case InstructionCode.Op_pushint: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushnamespace: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushnan: {
        return { code };
      }
      case InstructionCode.Op_pushnull: {
        return { code };
      }
      case InstructionCode.Op_pushscope: {
        return { code };
      }
      case InstructionCode.Op_pushshort: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushstring: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_pushtrue: {
        return { code };
      }
      case InstructionCode.Op_pushuint: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_undefined: {
        return { code };
      }
      case InstructionCode.Op_pushwith: {
        return { code };
      }
      case InstructionCode.Op_returnvalue: {
        return { code };
      }
      case InstructionCode.Op_returnvoid: {
        return { code };
      }
      case InstructionCode.Op_rshift: {
        return { code };
      }
      case InstructionCode.Op_setlocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_setlocal_0: {
        return { code };
      }
      case InstructionCode.Op_setlocal_1: {
        return { code };
      }
      case InstructionCode.Op_setlocal_2: {
        return { code };
      }
      case InstructionCode.Op_setlocal_3: {
        return { code };
      }
      case InstructionCode.Op_setglobalslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_setproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_setslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_setsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.Op_strictequals: {
        return { code };
      }
      case InstructionCode.Op_subtract: {
        return { code };
      }
      case InstructionCode.Op_subtract_i: {
        return { code };
      }
      case InstructionCode.Op_swap: {
        return { code };
      }
      case InstructionCode.Op_throw: {
        return { code };
      }
      case InstructionCode.Op_typeof: {
        return { code };
      }
      case InstructionCode.Op_urshift: {
        return { code };
      }
    }
  }
}
