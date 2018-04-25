import { expect } from 'chai';
import 'mocha';

import { SwfReader, Types } from '../../src';

let reader: SwfReader;
let header: Types.IHeader;

before((done) => {
  reader = new SwfReader('./tests/DofusInvoker.swf');
  header = reader.getHeader();
  done();
});

describe('SwfReader - Header', () => {

  it('should read the version', () => {
    expect(header.version).equals(11);
  });

  it('should read the signature', () => {
    expect(header.signature).equals(Types.SwfSignature.Zlib);
  });

  it('should read the fileLength', () => {
    expect(header.fileLength).equals(20634516);
  });

  it('should read the frameSize', () => {
    expect(header.frameSize.nBits).equals(16);
    expect(header.frameSize.xMin).equals(0);
    expect(header.frameSize.xMax).equals(25600);
    expect(header.frameSize.yMin).equals(0);
    expect(header.frameSize.yMax).equals(20480);
  });

  it('should read the frameRate', () => {
    expect(header.frameRate).equals(12800);
  });

  it('should read the frameCount', () => {
    expect(header.frameCount).equals(1);
  });

});
