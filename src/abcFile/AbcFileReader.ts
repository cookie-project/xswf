import SmarterBuffer from './../SmarterBuffer';
import { IAbcFile, IConstantPool, IMetadataInfo } from './types';
import { IInstanceInfo, InstanceInfoFlag } from './types/instance';
import { ConstantOptionKind, IMethodInfo, IOptionDetail, MethodInfoFlag } from './types/methods';
import { IMultiname, IMultinameL, IQName, IRTQName, IRTQNameL, MultinameInfo, MultinameKind } from './types/multiname';
import { INamespaceInfo, INamespaceSetInfo, NamespaceKind } from './types/namespace';
import { ITrait } from './types/trait';

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
    const metadataInfo = this.readMetadataInfo(constantPool);
    const classCount = this.buffer.readEncodedU30();
    const instance = this.readInstanceInfo(constantPool, methods);

    return {
      minorVersion,
      majorVersion,
      constantPool,
      methodCount,
      methods,
      metadataCount,
      metadataInfo,
      classCount,
      instance,
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
        const options: IOptionDetail[] = [];
        for (let x = 0; x < count; x++) {
          const valIndex = this.buffer.readEncodedU30();
          const kind: ConstantOptionKind = this.buffer.readUInt8();
          options.push({
            get val() {
              switch (kind) {
                case ConstantOptionKind.Int:
                  return constantPool.integers[valIndex];
                case ConstantOptionKind.UInt:
                  return constantPool.uintegers[valIndex];
                case ConstantOptionKind.Double:
                  return constantPool.doubles[valIndex];
                case ConstantOptionKind.Utf8:
                  return constantPool.strings[valIndex];
                case ConstantOptionKind.PackageNamespace:
                case ConstantOptionKind.Namespace:
                case ConstantOptionKind.PackageInternalNs:
                case ConstantOptionKind.ProtectedNamespace:
                case ConstantOptionKind.ExplicitNamespace:
                case ConstantOptionKind.StaticProtectedNs:
                case ConstantOptionKind.PrivateNs:
                  return constantPool.namespaces[valIndex];
                case ConstantOptionKind.True:
                case ConstantOptionKind.False:
                case ConstantOptionKind.Null:
                case ConstantOptionKind.Undefined:
                default:
                  return null;
              }
            },
            kind,
          });
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

  private readMetadataInfo(constantPool: IConstantPool): IMetadataInfo {
    const nameIndex = this.buffer.readEncodedU30();
    const itemCount = this.buffer.readEncodedU30();
    const keys: string[] = [];
    for (let i = 0; i < itemCount; i++) {
      keys.push(constantPool.strings[this.buffer.readEncodedU30()]);
    }
    const values: string[] = [];
    for (let j = 0; j < itemCount; j++) {
      values.push(constantPool.strings[this.buffer.readEncodedU30()]);
    }
    return {
      get name() {
        return constantPool.strings[nameIndex];
      },
      itemCount,
      keys,
      values,
    };
  }

  private readInstanceInfo(constantPool: IConstantPool, methods: IMethodInfo[]): IInstanceInfo {
    const nameIndex = this.buffer.readEncodedU30();
    const supernameIndex = this.buffer.readEncodedU30();
    const flags = this.buffer.readUInt8();

    let protectedNs: INamespaceInfo;

    if (flags & InstanceInfoFlag.ClassProtectedNs) {
      protectedNs = constantPool.namespaces[this.buffer.readEncodedU30()];
    }

    const interfaceCount = this.buffer.readEncodedU30();
    const interfaces: MultinameInfo[] = [];
    for (let i = 0; i < interfaceCount; i++) {
      interfaces.push(constantPool.multinames[this.buffer.readEncodedU30()]);
    }

    const iinitIndex = this.buffer.readEncodedU30();

    const traitCount = this.buffer.readEncodedU30();
    const traits: ITrait[] = [];
    for (let i = 0; i < traitCount; i++) {
      const nameIndex2 = this.buffer.readEncodedU30();
      const kind = this.buffer.readUInt8();
      /*
      traits.push({
        get name() {
          return constantPool.multinames[nameIndex2];
        },
        kind,
      });
      */
    }

    return {
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
    };
  }
}
