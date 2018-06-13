import { expect } from "chai";
import "mocha";

import { SwfReader, Types } from "../src";
import { TagCode } from "../src/Types";

let reader: SwfReader;
let file: Types.ISwf;

before(done => {
  reader = new SwfReader("./tests/DofusInvoker.swf");
  file = reader.getFile();
  done();
});

describe("SwfReader", () => {
  it("reader should be instanciated", () => {
    const assert = expect(reader).to.not.be.undefined;
  });

  it("file should not be undefined", () => {
    const assert = expect(file).to.not.be.undefined;
  });

  it("can getFile() over and over without errors", () => {
    file = reader.getFile();
    file = reader.getFile();
    file = reader.getFile();
  });
});

describe("SwfReader - Header", () => {
  it("header should not be undefined", () => {
    const assert = expect(file.header).to.not.be.undefined;
  });

  it("should read the signature", () => {
    expect(file.header.signature).equals(Types.SwfSignature.Zlib);
  });

  it("should read the fileLength", () => {
    expect(file.header.fileLength).equals(20634732);
  });

  it("should read the frameSize", () => {
    expect(file.header.frameSize.nBits).equals(16);
    expect(file.header.frameSize.xMin).equals(0);
    expect(file.header.frameSize.xMax).equals(25600);
    expect(file.header.frameSize.yMin).equals(0);
    expect(file.header.frameSize.yMax).equals(20480);
  });

  it("should read the frameRate", () => {
    expect(file.header.frameRate).equals(50.0);
  });

  it("should read the frameCount", () => {
    expect(file.header.frameCount).equals(1);
  });
});

describe("SwfReader - Tags", () => {
  it("tags should not be undefined", () => {
    const assert = expect(file.tags).to.not.be.undefined;
  });

  it("tags should contains DoABC TAG", () => {
    const tag = file.tags.find(t => t.code === TagCode.DoABC);
    const assert = expect(tag).to.not.be.undefined;
    expect(tag.length).equals(14958230);
  });
});
