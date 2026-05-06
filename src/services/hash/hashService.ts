import type { HashResult } from "../../types";
import { hexToBase64, textEncoder } from "../../utils/bytes";
import { hashAlgorithms } from "./algorithms";

type HashInput = string | Uint8Array;

type Sha3Bits = 224 | 256 | 384 | 512;

export async function calculateHash(algorithmId: string, input: HashInput): Promise<HashResult> {
  const algorithm = hashAlgorithms.find((item) => item.id === algorithmId);
  if (!algorithm) throw new Error("Unknown algorithm.");
  if (!algorithm.available) throw new Error(`${algorithm.label} is coming soon.`);

  const data = typeof input === "string" ? textEncoder.encode(input) : input;
  const wasm = await import("hash-wasm");
  let hexLower: string;

  if (algorithmId === "md5") hexLower = await wasm.md5(data);
  else if (algorithmId === "sha1") hexLower = await wasm.sha1(data);
  else if (algorithmId === "sha224") hexLower = await wasm.sha224(data);
  else if (algorithmId === "sha256") hexLower = await wasm.sha256(data);
  else if (algorithmId === "sha384") hexLower = await wasm.sha384(data);
  else if (algorithmId === "sha512") hexLower = await wasm.sha512(data);
  else if (algorithmId.startsWith("sha3-")) hexLower = await wasm.sha3(data, Number(algorithmId.split("-")[1]) as Sha3Bits);
  else if (algorithmId.startsWith("keccak-")) hexLower = await wasm.keccak(data, Number(algorithmId.split("-")[1]) as Sha3Bits);
  else if (algorithmId === "ripemd160") hexLower = await wasm.ripemd160(data);
  else if (algorithmId === "blake2b") hexLower = await wasm.blake2b(data, 512);
  else if (algorithmId === "blake2s") hexLower = await wasm.blake2s(data, 256);
  else if (algorithmId === "blake3") hexLower = await wasm.blake3(data, 256);
  else if (algorithmId === "crc32") hexLower = await wasm.crc32(data);
  else if (algorithmId === "adler32") hexLower = await wasm.adler32(data);
  else throw new Error(`${algorithm.label} is coming soon.`);

  return {
    algorithmId,
    algorithmLabel: algorithm.label,
    hexLower,
    hexUpper: hexLower.toUpperCase(),
    base64: algorithm.outputFormats.includes("base64") ? hexToBase64(hexLower) : undefined,
  };
}

export async function calculateManyHashes(algorithmIds: string[], input: HashInput): Promise<HashResult[]> {
  return Promise.all(algorithmIds.map((id) => calculateHash(id, input)));
}
