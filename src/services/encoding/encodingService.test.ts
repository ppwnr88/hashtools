import { describe, expect, it } from "vitest";
import { runEncoding } from "./encodingService";

describe("runEncoding", () => {
  it("encodes and decodes Base64", () => {
    expect(runEncoding("base64-encode", "hello")).toBe("aGVsbG8=");
    expect(runEncoding("base64-decode", "aGVsbG8=")).toBe("hello");
  });
});
