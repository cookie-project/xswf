import SmarterBuffer from "./../SmarterBuffer";
import { IAbcFile, IConstantPool, IMetadataInfo } from "./types";
import { Instruction, InstructionCode } from "./types/bytecode";
import { IClassInfo } from "./types/classes";
import { Constant, ConstantKind } from "./types/constant";
import { IInstanceInfo, InstanceInfoFlag } from "./types/instance";
import {
  IException,
  IMethodBody,
  IMethodInfo,
  MethodInfoFlag
} from "./types/methods";
import {
  IMultiname,
  IMultinameL,
  IQName,
  IRTQName,
  IRTQNameL,
  ITypeName,
  MultinameInfo,
  MultinameKind
} from "./types/multiname";
import {
  INamespaceInfo,
  INamespaceSetInfo,
  NamespaceKind
} from "./types/namespace";
import { IScriptInfo } from "./types/scripts";
import { ITrait, Trait, TraitAttribute, TraitKind } from "./types/trait";
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
    const methodBodies: IMethodBody[] = [];
    const instances = this.readInstances(
      classCount,
      constantPool,
      methods,
      classes,
      methodBodies
    );
    for (let i = 0; i < classCount; i++) {
      classes.push(
        this.readClass(i, constantPool, methods, classes, instances, methodBodies)
      );
    }
    const scriptCount = this.buffer.readEncodedU30();
    const scripts: IScriptInfo[] = [];
    for (let i = 0; i < scriptCount; i++) {
      scripts.push(this.readScript(constantPool, methods, classes, methodBodies));
    }
    const methodBodyCount = this.buffer.readEncodedU30();
    for (let i = 0; i < methodBodyCount; i++) {
      methodBodies.push(
        this.readMethodBodies(
          methodBodyCount,
          methods,
          constantPool,
          classes,
          methodBodies
        )
      );
    }

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
      methodBodies
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
    const strings = ["*"];
    for (let i = 1; i < stringCount; i++) {
      const size = this.buffer.readEncodedU30();
      strings.push(this.buffer.readBuffer(size).toString("utf8"));
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
        }
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
            }
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
            }
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
            }
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
            }
          };
          multinames.push(multinamel);
          break;
        case MultinameKind.TypeName:
          const name4 = this.buffer.readEncodedU30();
          const paramsCount = this.buffer.readEncodedU30();
          const params: number[] = [];
          for (let j = 0; j < paramsCount; j++) {
            params.push(this.buffer.readEncodedU30());
          }
          const typeName: ITypeName = {
            kind,
            get name() {
              return multinames[name4];
            },
            get names() {
              return params.map(p => multinames[p]);
            },
          }
          multinames.push(typeName);
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
      multinames
    };
  }

  private buildConstant(
    kind: ConstantKind,
    valueIndex: number,
    constantPool: IConstantPool
  ): Constant {
    switch (kind) {
      case ConstantKind.Int:
        return {
          kind,
          get val() {
            return constantPool.integers[valueIndex];
          }
        };
      case ConstantKind.UInt:
        return {
          kind,
          get val() {
            return constantPool.uintegers[valueIndex];
          }
        };
      case ConstantKind.Double:
        return {
          kind,
          get val() {
            return constantPool.doubles[valueIndex];
          }
        };
      case ConstantKind.Utf8:
        return {
          kind,
          get val() {
            return constantPool.strings[valueIndex];
          }
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
          }
        };
      case ConstantKind.True:
        return {
          kind,
          get val(): true {
            return true;
          }
        };
      case ConstantKind.False:
        return {
          kind,
          get val(): false {
            return false;
          }
        };
      case ConstantKind.Null:
        return {
          kind,
          get val(): null {
            return null;
          }
        };
      case ConstantKind.Undefined:
        return {
          kind,
          get val(): null {
            return undefined;
          }
        };
    }
  }

  private readMethods(
    methodCount: number,
    constantPool: IConstantPool
  ): IMethodInfo[] {
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
        flags
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

  private readMetadataInfos(
    metadataCount: number,
    constantPool: IConstantPool
  ): IMetadataInfo[] {
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
        values
      });
    }
    return metadatas;
  }

  private readTrait(
    constantPool: IConstantPool,
    methods: IMethodInfo[],
    classes: IClassInfo[],
    methodBodies: IMethodBody[]
  ): Trait {
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
            return constantPool.multinames[nameIndex2] as IQName;
          },
          kind,
          slotId,
          get typeName() {
            return constantPool.multinames[typeNameIndex];
          },
          value:
            vindex > 0
              ? this.buildConstant(vkind, vindex, constantPool)
              : undefined
        };
        break;
      }
      case TraitKind.Class: {
        const slotId = this.buffer.readEncodedU30();
        const classi = this.buffer.readEncodedU30();
        trait = {
          get name() {
            return constantPool.multinames[nameIndex2] as IQName;
          },
          kind,
          get class() {
            return classes[classi];
          }
        };
        break;
      }
      case TraitKind.Function: {
        const slotId = this.buffer.readEncodedU30();
        const functionIndex = this.buffer.readEncodedU30();
        trait = {
          get name() {
            return constantPool.multinames[nameIndex2] as IQName;
          },
          kind,
          slotId,
          get func() {
            return methods[methodIndex];
          },
          get funcBody() {
            return methodBodies.find((mb) => mb.methodIndex === methodIndex);
          },
        };
        break;
      }
      case TraitKind.Method:
      case TraitKind.Getter:
      case TraitKind.Setter:
        const dispId = this.buffer.readEncodedU30();
        const methodIndex = this.buffer.readEncodedU30();
        let attribute: TraitAttribute;
        if (attrs & 0x1) {
          attribute = TraitAttribute.Final;
        } else if (attrs & 0x2) {
          attribute = TraitAttribute.Override
        }
        trait = {
          dispId,
          get name() {
            return constantPool.multinames[nameIndex2] as IQName;
          },
          attribute,
          kind,
          get method() {
            return methods[methodIndex];
          },
          get methodBody() {
            return methodBodies.find((mb) => mb.methodIndex === methodIndex);
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

  private readClass(
    index: number,
    constantPool: IConstantPool,
    methods: IMethodInfo[],
    classes: IClassInfo[],
    instances: IInstanceInfo[],
    methodBodies: IMethodBody[]
  ): IClassInfo {
    const cinitIndex = this.buffer.readEncodedU30();
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let i = 0; i < traitCount; i++) {
      traits.push(this.readTrait(constantPool, methods, classes, methodBodies));
    }
    return {
      get instance() {
        return instances[index];
      },
      get cinit() {
        return methods[cinitIndex];
      },
      get cinitBody() {
        return methodBodies.find((mb) => mb.methodIndex === cinitIndex)
      },
      traitCount,
      traits
    };
  }

  private readScript(
    constantPool: IConstantPool,
    methods: IMethodInfo[],
    classes: IClassInfo[],
    methodBodies: IMethodBody[]
  ): IScriptInfo {
    const initIndex = this.buffer.readEncodedU30();
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let i = 0; i < traitCount; i++) {
      traits.push(this.readTrait(constantPool, methods, classes, methodBodies));
    }
    return {
      get init() {
        return methods[initIndex];
      },
      traitCount,
      traits
    };
  }

  private readInstances(
    classCount: number,
    constantPool: IConstantPool,
    methods: IMethodInfo[],
    classes: IClassInfo[],
    methodBodies: IMethodBody[]
  ): IInstanceInfo[] {
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
        traits.push(this.readTrait(constantPool, methods, classes, methodBodies));
      }

      instances.push({
        get class() {
          return classes[i];
        },
        get name() {
          return constantPool.multinames[nameIndex] as IQName;
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
        traits
      });
    }
    return instances;
  }

  private readExceptions(
    exceptionCount: number,
    multinames: MultinameInfo[]
  ): IException[] {
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
        }
      });
    }
    return exceptions;
  }

  private readMethodBodies(
    methodBodyCount: number,
    methods: IMethodInfo[],
    constantPool: IConstantPool,
    classes: IClassInfo[],
    methodBodies: IMethodBody[],
  ): IMethodBody {
    const methodIndex = this.buffer.readEncodedU30();
    const maxStack = this.buffer.readEncodedU30();
    const localCount = this.buffer.readEncodedU30();
    const initScopeDepth = this.buffer.readEncodedU30();
    const maxScopeDepth = this.buffer.readEncodedU30();
    const codeLength = this.buffer.readEncodedU30();
    const startOffset = this.buffer.readOffset;
    const code: Instruction[] = [];
    while (this.buffer.readOffset < startOffset + codeLength) {
      const byteOffset = this.buffer.readOffset - startOffset;
      code.push(
        Object.assign(this.readInstruction(constantPool), { byteOffset })
      );
    }

    const exceptionCount = this.buffer.readEncodedU30();
    const exceptions = this.readExceptions(
      exceptionCount,
      constantPool.multinames
    );
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let y = 0; y < traitCount; y++) {
      traits.push(this.readTrait(constantPool, methods, classes, methodBodies));
    }

    return {
      get method() {
        return methods[methodIndex];
      },
      methodIndex,
      maxStack,
      localCount,
      initScopeDepth,
      maxScopeDepth,
      codeLength,
      code,
      exceptionCount,
      exceptions,
      traitCount,
      traits
    };
  }


  private readInstruction(constantPool: IConstantPool): Instruction {
    const code: InstructionCode = this.buffer.readUInt8();
    switch (code) {
      case InstructionCode.add: {
        return { code };
      }
      case InstructionCode.add_i: {
        return { code };
      }
      case InstructionCode.astype: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.astypelate: {
        return { code };
      }
      case InstructionCode.bitand: {
        return { code };
      }
      case InstructionCode.bitnot: {
        return { code };
      }
      case InstructionCode.bitor: {
        return { code };
      }
      case InstructionCode.bitxor: {
        return { code };
      }
      case InstructionCode.call: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.callmethod: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.callproperty: {
        const index = this.buffer.readEncodedU30();
        const argCount = this.buffer.readEncodedU30();
        return {
          argCount,
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.callproplex: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.callpropvoid: {
        const index = this.buffer.readEncodedU30();
        const argCount = this.buffer.readEncodedU30();
        return {
          argCount,
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.callstatic: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.callsuper: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.callsupervoid: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.checkfilter: {
        return { code };
      }
      case InstructionCode.coerce: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.coerce_a: {
        return { code };
      }
      case InstructionCode.coerce_s: {
        return { code };
      }
      case InstructionCode.construct: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.contructprop: {
        const index = this.buffer.readEncodedU30();
        const argCount = this.buffer.readEncodedU30();
        return {
          argCount,
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.constructsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.convert_b: {
        return { code };
      }
      case InstructionCode.convert_i: {
        return { code };
      }
      case InstructionCode.convert_d: {
        return { code };
      }
      case InstructionCode.convert_o: {
        return { code };
      }
      case InstructionCode.convert_u: {
        return { code };
      }
      case InstructionCode.convert_s: {
        return { code };
      }
      case InstructionCode.debug: {
        const operand0 = this.buffer.readUInt8();
        const operand1 = this.buffer.readEncodedU30();
        const operand2 = this.buffer.readUInt8();
        const operand3 = this.buffer.readEncodedU30();
        return { code, operand0, operand1, operand2, operand3 };
      }
      case InstructionCode.debugfile: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.debugline: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.declocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.declocal_i: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.decrement: {
        return { code };
      }
      case InstructionCode.decrement_i: {
        return { code };
      }
      case InstructionCode.deleteproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.divide: {
        return { code };
      }
      case InstructionCode.dup: {
        return { code };
      }
      case InstructionCode.dxns: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.dxnslate: {
        return { code };
      }
      case InstructionCode.equals: {
        return { code };
      }
      case InstructionCode.esc_xattr: {
        return { code };
      }
      case InstructionCode.esc_xelem: {
        return { code };
      }
      case InstructionCode.findproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.findpropstrict: {
        const index = this.buffer.readEncodedU30();
        return {
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.getdescendants: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.getglobalscope: {
        return { code };
      }
      case InstructionCode.getglobalslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.getlex: {
        const index = this.buffer.readEncodedU30();
        return {
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.getlocal: {
        const index = this.buffer.readEncodedU30();
        return { code, index };
      }
      case InstructionCode.getlocal_0: {
        return { code };
      }
      case InstructionCode.getlocal_1: {
        return { code };
      }
      case InstructionCode.getlocal_2: {
        return { code };
      }
      case InstructionCode.getlocal_3: {
        return { code };
      }
      case InstructionCode.getproperty: {
        const index = this.buffer.readEncodedU30();
        return {
          code,
          get name() {
            return constantPool.multinames[index];
          }
        };
      }
      case InstructionCode.getscopeobject: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.getslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.getsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.greaterequals: {
        return { code };
      }
      case InstructionCode.greaterthan: {
        return { code };
      }
      case InstructionCode.hasnext: {
        return { code };
      }
      case InstructionCode.hasnext2: {
        const operand0 = this.buffer.readEncodedU30();
        const operand1 = this.buffer.readEncodedU30();
        return { code, operand0, operand1 };
      }
      case InstructionCode.ifeq: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.iffalse: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifge: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifgt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifle: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.iflt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifnge: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifngt: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifnle: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifnlt: {
        const offset = this.buffer.readS24();
        return { code, offset };
      }
      case InstructionCode.ifne: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifstricteq: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.ifstrictne: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.iftrue: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.in: {
        return { code };
      }
      case InstructionCode.inclocal: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.inclocal_i: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.increment: {
        return { code };
      }
      case InstructionCode.increment_i: {
        return { code };
      }
      case InstructionCode.initproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.instanceof: {
        return { code };
      }
      case InstructionCode.istype: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.istypelate: {
        return { code };
      }
      case InstructionCode.jump: {
        const operand0 = this.buffer.readS24();
        return { code, operand0 };
      }
      case InstructionCode.kill: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.label: {
        return { code };
      }
      case InstructionCode.lessequals: {
        return { code };
      }
      case InstructionCode.lessthan: {
        return { code };
      }
      case InstructionCode.lookupswitch: {
        const operand0 = this.buffer.readS24();
        const count = this.buffer.readEncodedU30();
        const cases = [];
        for (let i = 0; i < count + 1; i++) {
          cases.push(this.buffer.readS24());
        }
        return { code, operand0, cases };
      }
      case InstructionCode.lshift: {
        return { code };
      }
      case InstructionCode.modulo: {
        return { code };
      }
      case InstructionCode.multiply: {
        return { code };
      }
      case InstructionCode.multiply_i: {
        return { code };
      }
      case InstructionCode.negate: {
        return { code };
      }
      case InstructionCode.negate_i: {
        return { code };
      }
      case InstructionCode.newactivation: {
        return { code };
      }
      case InstructionCode.newarray: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.newcatch: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.newclass: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.newfunction: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.newobject: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.nextname: {
        return { code };
      }
      case InstructionCode.nextvalue: {
        return { code };
      }
      case InstructionCode.nop: {
        return { code };
      }
      case InstructionCode.not: {
        return { code };
      }
      case InstructionCode.pop: {
        return { code };
      }
      case InstructionCode.popscope: {
        return { code };
      }
      case InstructionCode.pushbyte: {
        const byteValue = this.buffer.readUInt8();
        return { code, byteValue };
      }
      case InstructionCode.pushdouble: {
        const index = this.buffer.readEncodedU30();
        return {
          code,
          get value() {
            return constantPool.doubles[index];
          }
        };
      }
      case InstructionCode.pushfalse: {
        return { code };
      }
      case InstructionCode.pushint: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.pushnamespace: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.pushnan: {
        return { code };
      }
      case InstructionCode.pushnull: {
        return { code };
      }
      case InstructionCode.pushscope: {
        return { code };
      }
      case InstructionCode.pushshort: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.pushstring: {
        const index = this.buffer.readEncodedU30();
        return {
          code,
          get value() {
            return constantPool.strings[index];
          }
        };
      }
      case InstructionCode.pushtrue: {
        return { code };
      }
      case InstructionCode.pushuint: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.undefined: {
        return { code };
      }
      case InstructionCode.pushwith: {
        return { code };
      }
      case InstructionCode.returnvalue: {
        return { code };
      }
      case InstructionCode.returnvoid: {
        return { code };
      }
      case InstructionCode.rshift: {
        return { code };
      }
      case InstructionCode.setlocal: {
        const index = this.buffer.readEncodedU30();
        return { code, index };
      }
      case InstructionCode.setlocal_0: {
        return { code };
      }
      case InstructionCode.setlocal_1: {
        return { code };
      }
      case InstructionCode.setlocal_2: {
        return { code };
      }
      case InstructionCode.setlocal_3: {
        return { code };
      }
      case InstructionCode.setglobalslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.setproperty: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.setslot: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.setsuper: {
        const operand0 = this.buffer.readEncodedU30();
        return { code, operand0 };
      }
      case InstructionCode.strictequals: {
        return { code };
      }
      case InstructionCode.subtract: {
        return { code };
      }
      case InstructionCode.subtract_i: {
        return { code };
      }
      case InstructionCode.swap: {
        return { code };
      }
      case InstructionCode.throw: {
        return { code };
      }
      case InstructionCode.typeof: {
        return { code };
      }
      case InstructionCode.urshift: {
        return { code };
      }
      case InstructionCode.applytype: {
        return { code };
      }
      case InstructionCode.bkpt: {
        return { code };
      }
      case InstructionCode.lf32: {
        return { code };
      }
      case InstructionCode.lf64: {
        return { code };
      }
      case InstructionCode.li16: {
        return { code };
      }
      case InstructionCode.li32: {
        return { code };
      }
      case InstructionCode.li8: {
        return { code };
      }
      case InstructionCode.sf32: {
        return { code };
      }
      case InstructionCode.sf64: {
        return { code };
      }
      case InstructionCode.si16: {
        return { code };
      }
      case InstructionCode.si32: {
        return { code };
      }
      case InstructionCode.si8: {
        return { code };
      }
      case InstructionCode.sxi1: {
        return { code };
      }
      case InstructionCode.sxi16: {
        return { code };
      }
      case InstructionCode.sxi8: {
        return { code };
      }
      default: {
        throw new Error("could not read instruction with code " + code);
      }
    }
  }
}
