// tslint:disable

import { IQName, MultinameKind } from './src/abcFile/types/multiname';
import SmarterBuffer from './src/SmarterBuffer';
import SwfReader from './src/SwfReader';
import * as Types from './src/Types';
import { InstructionCode } from './src/abcFile/types/bytecode';
import { TraitKind, ITraitSlot } from './src/abcFile/types/trait';

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

const bodies = methodBodies.filter((methodBody) => {
  return methodBody.method.name.includes("deserializeAs_");
});

//log(body);

const opcodes = new Set<InstructionCode>();

bodies.forEach((body) => {
  body.code.forEach((instr) => {
    opcodes.add(instr.code);
  });
});

//log(opcodes.values());

const messageClasses = doAbc.abcFile.instances.filter(c => c.name.kind === MultinameKind.QName && c.name.ns.name.includes('dofus.network.messages'))

messageClasses.forEach((messageClass) => {
  const name: IQName = messageClass.name as IQName;
  const protocolIdTrait = messageClass.class.traits.find((trait) => {
    return trait.kind === TraitKind.Const && trait.name.kind === MultinameKind.QName && trait.name.name === "protocolId";
  }) as ITraitSlot;
  const protocolId: number = protocolIdTrait.value.val as number;
  console.log(protocolId, name.name);
});


//log(body.code.map((instr) => InstructionCode[instr.code]));
