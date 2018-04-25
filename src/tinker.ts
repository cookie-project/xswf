import SmarterBuffer from './SmarterBuffer';
import SwfReader from './SwfReader';
import * as Types from './Types';

const reader = new SwfReader('./tests/DofusInvoker.swf');

console.log(JSON.stringify(reader.getFile().header, null, 2));
console.log(JSON.stringify(reader.getFile().tags.filter((tag) => tag.code === Types.TagCode.DoABC), null, 2));
