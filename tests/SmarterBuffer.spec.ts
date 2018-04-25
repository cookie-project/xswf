import { expect } from 'chai';
import 'mocha';

import { SmarterBuffer } from '../src';

let buffer: SmarterBuffer;

describe('SmarterBuffer', () => {

  it('should instanciate the class', () => {
    buffer = new SmarterBuffer();
    const assert = expect(buffer).to.not.be.undefined;
  });

});
