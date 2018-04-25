import { SmartBuffer, SmartBufferOptions } from 'smart-buffer';
import { IRect } from './Types';

export default class SmarterBuffer extends SmartBuffer {

  public static fromBuffer(buff: Buffer, encoding?: BufferEncoding): SmarterBuffer {
    return new this({ buff, encoding });
  }

  constructor(options?: SmartBufferOptions) {
    super(options);
  }

  public readRect(): IRect {
    const nBits: number = 42;
    const xMin: number = 42;
    const xMax: number = 42;
    const yMin: number = 42;
    const yMax: number = 42;
    return { nBits, xMin, xMax, yMin, yMax };
  }

/*   public readEncodedU32(pos: any): number {
    let result: number = pos[0];
    if (!(result & 0x00000080)) {
      pos++;
      return result;
    }
    result = (result & 0x0000007f) | pos[1] << 7;
    if (!(result & 0x00004000)) {
      pos += 2;
      return result;
    }
    result = (result & 0x00003fff) | pos[2] << 14;
    if (!(result & 0x00200000)) {
      pos += 3;
      return result;
    }
    result = (result & 0x001fffff) | pos[3] << 21;
    if (!(result & 0x10000000)) {
      pos += 4;
      return result;
    }
    result = (result & 0x0fffffff) | pos[4] << 28;
    pos += 5;
    return result;
  } */
}
