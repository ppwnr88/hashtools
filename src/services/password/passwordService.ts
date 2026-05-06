import CryptoJS from "crypto-js";
import { bytesToHex, randomBytes } from "../../utils/bytes";

export function generateSaltHex(length = 16): string {
  return bytesToHex(randomBytes(length));
}

export async function bcryptHash(password: string, saltHex: string, costFactor: number): Promise<string> {
  const { bcrypt } = await import("hash-wasm");
  return bcrypt({
    password,
    salt: hexToBytesForHashWasm(saltHex),
    costFactor,
    outputType: "encoded",
  });
}

export async function bcryptVerifyPassword(password: string, hash: string): Promise<boolean> {
  const { bcryptVerify } = await import("hash-wasm");
  return bcryptVerify({ password, hash });
}

export async function argon2idHash(password: string, saltHex: string): Promise<string> {
  const { argon2id } = await import("hash-wasm");
  return argon2id({
    password,
    salt: hexToBytesForHashWasm(saltHex),
    iterations: 3,
    parallelism: 1,
    memorySize: 19456,
    hashLength: 32,
    outputType: "encoded",
  });
}

export async function argon2VerifyPassword(password: string, hash: string): Promise<boolean> {
  const { argon2Verify } = await import("hash-wasm");
  return argon2Verify({ password, hash });
}

export function derivePbkdf2(password: string, salt: string, iterations: number, keyLength: number, digest: "SHA-1" | "SHA-256" | "SHA-512") {
  const hasher = {
    "SHA-1": CryptoJS.algo.SHA1,
    "SHA-256": CryptoJS.algo.SHA256,
    "SHA-512": CryptoJS.algo.SHA512,
  }[digest];
  const result = CryptoJS.PBKDF2(password, salt, {
    keySize: keyLength / 4,
    iterations,
    hasher,
  });
  return result.toString(CryptoJS.enc.Hex);
}

function hexToBytesForHashWasm(hex: string): Uint8Array {
  const clean = hex.trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) out[i / 2] = Number.parseInt(clean.slice(i, i + 2), 16);
  return out;
}
