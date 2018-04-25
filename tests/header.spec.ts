import { expect } from 'chai';
import 'mocha';

import { getHeader } from '../src';

describe('Header tests', () => {
  it('should correctly read the header', () => {
    const header = getHeader('./tests/DofusInvoker.swf');
    expect(header.version).equals(11);
  });
});
