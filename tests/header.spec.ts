import { expect } from 'chai';
import 'mocha';

import { getHeader } from '../src';
import { IHeader, SwfCompression } from '../src/Types';

let header: IHeader;

before((done) => {
  header = getHeader('./tests/DofusInvoker.swf');
  done();
});

describe('Header tests', () => {

  it('should read the version', () => {
    expect(header.version).equals(11);
  });

  it('should read the signature', () => {
    expect(header.signature).equals(SwfCompression.None);
  });

  it('should read the fileLength', () => {
    expect(header.fileLength).equals(12098065);
  });

  it('should read the frameSize', () => {
    expect(header.frameSize.nBits).equals(42);
    expect(header.frameSize.xMin).equals(42);
    expect(header.frameSize.xMax).equals(42);
    expect(header.frameSize.yMin).equals(42);
    expect(header.frameSize.yMax).equals(42);
  });

  it('should read the frameRate', () => {
    expect(header.frameRate).equals(128);
  });

  it('should read the frameCount', () => {
    expect(header.frameCount).equals(8195);
  });

});
