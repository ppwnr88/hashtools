import type { IdentifierGuess } from "../../types";

export function identifyHash(input: string): IdentifierGuess[] {
  const value = input.trim();
  if (!value) return [];
  const guesses: IdentifierGuess[] = [];
  const hex = /^[a-f0-9]+$/i.test(value);

  if (/^\$2[abyx]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)) {
    guesses.push({ name: "bcrypt", confidence: "High", reason: "Matches the bcrypt modular crypt format with cost and 53-character payload." });
  }
  if (/^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+={0,2}\$[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    guesses.push({ name: "argon2", confidence: "High", reason: "Matches the Argon2 encoded format with version, parameters, salt, and hash." });
  }
  if (hex) {
    const map: Record<number, string> = {
      32: "MD5",
      40: "SHA1 or RIPEMD-160",
      56: "SHA224",
      64: "SHA256, SHA3-256, Keccak-256, BLAKE2s, or BLAKE3",
      96: "SHA384 or SHA3-384",
      128: "SHA512, SHA3-512, Keccak-512, or BLAKE2b",
    };
    const name = map[value.length];
    if (name) guesses.push({ name, confidence: "High", reason: `Hex string has ${value.length} characters, matching common digest lengths.` });
    guesses.push({ name: "hex-like", confidence: "Medium", reason: "Contains only hexadecimal characters." });
  }
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length % 4 === 0) {
    guesses.push({ name: "base64-like", confidence: "Medium", reason: "Uses Base64 characters and padding-compatible length." });
  }
  if (!guesses.length) {
    guesses.push({ name: "Unknown or custom format", confidence: "Low", reason: "No common length or prefix pattern matched." });
  }
  return guesses;
}
