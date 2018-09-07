// tslint:disable

import { IQName, MultinameKind } from "./src/abcFile/types/multiname";
import SmarterBuffer from "./src/SmarterBuffer";
import SwfReader from "./src/SwfReader";
import * as Types from "./src/Types";
import { InstructionCode } from "./src/abcFile/types/bytecode";
import { TraitKind, ITraitSlot, ITraitMethod } from "./src/abcFile/types/trait";
import { IMethodInfo } from "./src/abcFile/types/methods";

function log(obj: any) {
  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(obj, null, 2));
}

const reader = new SwfReader("./test/DofusInvoker.swf");

const file = reader.getFile();

// log(file.header);

const doAbc = file.tags.find(
  tag => tag.code === Types.TagCode.DoABC
) as Types.ITagDoAbc;

// log(doAbc.abcFile.constantPool.namespaces.filter((n) => n.name.includes('com.ankamagames.dofus.network.messages')));

const constantPool = doAbc.abcFile.constantPool;

const qname = constantPool.multinames.find(
  m =>
    m &&
    m.kind === MultinameKind.QName &&
    m.name.indexOf("deserializeAs") !== -1
) as IQName;

// log(qname);

const methods = doAbc.abcFile.methods;

const method = methods.filter(m => m.name.indexOf("deserializeAs_") !== -1);

// log(method[method.length - 1]);

const metadata = doAbc.abcFile.metadataInfos;

// log(metadata);

const instances = doAbc.abcFile.instances;

// log(instances.filter((instance) =>
//  instance.name.kind === MultinameKind.QName && instance.name.ns.name.includes('dofus.network.messages'))[0]);

const methodBodies = doAbc.abcFile.methodBodies;

const bodies = methodBodies.filter(methodBody => {
  return methodBody.method.name.includes("deserializeAs_");
});

// log(body);

const opcodes = new Set<InstructionCode>();

bodies.forEach(body => {
  body.code.forEach(instr => {
    opcodes.add(instr.code);
  });
});

// log(opcodes.values());

const messageClasses = doAbc.abcFile.instances.filter(
  c =>
    c.name.kind === MultinameKind.QName &&
    c.name.ns.name.includes("dofus.network.messages")
);

const messages = messageClasses.map(messageClass => {
  const name: IQName = messageClass.name as IQName;
  const protocolIdTrait = messageClass.class.traits.find(trait => {
    return (
      trait.kind === TraitKind.Const &&
      trait.name.kind === MultinameKind.QName &&
      trait.name.name === "protocolId"
    );
  }) as ITraitSlot;
  const protocolId: number = protocolIdTrait.value.val as number;
  return { id: protocolId, name: name.name };
});

const orderedMessages = messages.sort((a, b) => a.id - b.id);

const toLog = orderedMessages.map(m => `${m.id}: ${m.name}`);

// log(toLog);

const klass = messageClasses.find(
  klass =>
    klass.name.kind === MultinameKind.QName &&
    klass.name.name === "MapComplementaryInformationsDataMessage"
);

const body = doAbc.abcFile.methodBodies.find(m =>
  m.method.name.includes("serializeAs_MapComplementaryInformationsDataMessage")
);

const codes = body.code.filter(c => {
  if (
    c.code === InstructionCode.debug ||
    c.code === InstructionCode.debugfile ||
    c.code === InstructionCode.debugline
  ) {
    return;
  }
  return c;
});
// tslint:disable-next-line:no-console
console.log(
  codes.map(c => `${InstructionCode[c.code]} ${JSON.stringify(c)}`).join("\n")
);
// console.log(`${body.method.name} -> ${JSON.stringify(codes.map((c) => `${InstructionCode[c.code]}`))}`);

// log(body.code.map((instr) => InstructionCode[instr.code]));
