import * as assert from "assert";
import { AsnParser } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import { AttributeCertificate } from "../src";

context("x509-attr", () => {

  it("cert #1", () => {
    const pem = "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";
    const cert = AsnParser.parse(Convert.FromBase64(pem), AttributeCertificate);

    assert.equal(!!cert, true);
  });

});
