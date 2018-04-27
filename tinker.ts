import * as AbcTypes from './src/abcFile/Types';
import SmarterBuffer from './src/SmarterBuffer';
import SwfReader from './src/SwfReader';
import * as Types from './src/Types';

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

const qname = constantPool.multinames.find((m) => m && m.kind === AbcTypes.MultinameKind.QName) as AbcTypes.IQName;

// log(qname);

const methods = doAbc.abcFile.methods;

log(methods[3]);
