import SmarterBuffer from './src/SmarterBuffer';
import SwfReader from './src/SwfReader';
import * as Types from './src/Types';
import { IQName, MultinameKind } from './src/abcFile/Types/multiname';

function log(obj: any) {
  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(obj, null, 2));
}

const reader = new SwfReader('./tests/DofusInvoker.swf');

const file = reader.getFile();

// log(file.header);

const doAbc = file.tags.find((tag) => tag.code === Types.TagCode.DoABC) as Types.ITagDoAbc;

// log(doAbc.abcFile.constantPool.namespaces.filter((n) => n.name.includes('com.ankamagames.dofus.network.messages')));

const constantPool = doAbc.abcFile.constantPool;

const qname = constantPool.multinames.find((m) => m && m.kind === MultinameKind.QName
  && m.name.indexOf('deserializeAs') !== -1) as IQName;

// log(qname);

const methods = doAbc.abcFile.methods;

const method = methods.filter((m) => m.name.indexOf('deserializeAs_') !== -1);

// log(method[method.length - 1]);

const metadata = doAbc.abcFile.metadataInfo;

// log(metadata);

const instance = doAbc.abcFile.instance;

log(instance.traitCount);
