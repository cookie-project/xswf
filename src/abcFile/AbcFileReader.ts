import SmarterBuffer from './../SmarterBuffer';
import {
  ConstantOptionKind, IAbcFile, IConstantPool, IMethodInfo,
  IMultiname, IMultinameInfo,
  IMultinameL, INamespaceInfo, INamespaceSetInfo, IOptionDetail, IOptionInfo, IParamInfos,
  IQName, IRTQName, IRTQNameL, MethodInfoFlag, MultinameInfo, MultinameKind, NamespaceKind,
} from './Types';

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

    return {
      minorVersion,
      majorVersion,
      constantPool,
      methodCount,
      methods,
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
            get nsSet() {
              return nsSet[nsSetIndex];
            },
            get name() {
              return strings[name3];
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
    let tmp = 0;
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
            kind,
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
console.log(methodCount, tmp);
    return methods;
  }
}
