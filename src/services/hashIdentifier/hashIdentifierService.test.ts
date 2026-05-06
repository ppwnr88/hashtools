import { describe, expect, it } from "vitest";
import { identifyHash } from "./hashIdentifierService";

describe("identifyHash", () => {
  it("detects MD5-looking input", () => {
    expect(identifyHash("5d41402abc4b2a76b9719d911017c592")[0].name).toBe("MD5");
  });

  it("detects bcrypt format", () => {
    const guesses = identifyHash("$2b$10$abcdefghijklmnopqrstuu4VwQyS4IfK6kA2aYzZxGq1oHt9v3V6G");
    expect(guesses[0].name).toBe("bcrypt");
  });
});
