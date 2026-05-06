import { describe, expect, it } from "vitest";
import { calculateHash } from "./hashService";

describe("calculateHash", () => {
  it("matches known MD5 vector", async () => {
    const result = await calculateHash("md5", "hello");
    expect(result.hexLower).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("matches known SHA1 vector", async () => {
    const result = await calculateHash("sha1", "hello");
    expect(result.hexLower).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
  });

  it("matches known SHA256 vector", async () => {
    const result = await calculateHash("sha256", "hello");
    expect(result.hexLower).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
  });
});
