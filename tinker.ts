import { IQName, MultinameKind } from './src/abcFile/types/multiname';
import SmarterBuffer from './src/SmarterBuffer';
import SwfReader from './src/SwfReader';
import * as Types from './src/Types';
import { InstructionCode } from './src/abcFile/types/bytecode';

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

const metadata = doAbc.abcFile.metadataInfos;

// log(metadata);

const instances = doAbc.abcFile.instances;

// log(instances.filter((instance) =>
//  instance.name.kind === MultinameKind.QName && instance.name.ns.name.includes('dofus.network.messages'))[0]);

const methodBodies = doAbc.abcFile.methodBodies;

const body = methodBodies.find((methodBody) => {
  return methodBody.method.name.includes("deserializeAs_");
});

//log(body);

log(body.code.map((instr) => InstructionCode[instr.code]));
