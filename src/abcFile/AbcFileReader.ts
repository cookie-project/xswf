import SmarterBuffer from './../SmarterBuffer';
import { IAbcFile, IConstantPool, IMetadataInfo } from './types';
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
      classes.push(this.readClass(constantPool, methods, classes));
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
          value: vkind > 0 ? this.buildConstant(vindex, vindex, constantPool) : undefined,
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

  private readClass(constantPool: IConstantPool, methods: IMethodInfo[], classes: IClassInfo[]): IClassInfo {
    const cinitIndex = this.buffer.readEncodedU30();
    const traitCount = this.buffer.readEncodedU30();
    const traits: Trait[] = [];
    for (let i = 0; i < traitCount; i++) {
      traits.push(this.readTrait(constantPool, methods, classes));
    }
    return {
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
      const code = this.buffer.readBuffer(codeLength);
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
}
