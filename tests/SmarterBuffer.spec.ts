import { expect } from 'chai';
import 'mocha';

import { SmarterBuffer } from '../src';

let buffer: SmarterBuffer;

describe('SmarterBuffer', () => {

  it('should instanciate the class', () => {
    buffer = new SmarterBuffer();
    const assert = expect(buffer).to.not.be.undefined;
  });

  it('should readFixed()', () => {
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(0x07);
    buffer.writeUInt8(0x00);
    const value = buffer.readFixed();
    expect(value).equals(7.5);
  });

  it('should readFixed(32)', () => {
    buffer.writeUInt8(0x00);
    buffer.writeUInt8(0x80);
    buffer.writeUInt8(0x07);
    buffer.writeUInt8(0x00);
    const value = buffer.readFixed(32);
    expect(value).equals(7.5);
  });

  it('should readFixed(16)', () => {
    buffer.writeUInt8(0x08);
    buffer.writeUInt8(0x80);
    const value = buffer.readFixed(16);
    expect(value).equals(128.03125);
  });

});
