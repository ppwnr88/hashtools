import { v4 as uuidv4 } from "uuid";
import { base64ToBytes, bytesToBase64, bytesToHex, hexToBytes, randomBytes, textDecoder, textEncoder } from "../../utils/bytes";

export type EncodingMode =
  | "base64-encode"
  | "base64-decode"
  | "base64url-encode"
  | "base64url-decode"
  | "hex-encode"
  | "hex-decode"
  | "url-encode"
  | "url-decode"
  | "utf8-to-hex"
  | "hex-to-utf8";

export function runEncoding(mode: EncodingMode, input: string): string {
  switch (mode) {
    case "base64-encode":
      return bytesToBase64(textEncoder.encode(input));
    case "base64-decode":
      return textDecoder.decode(base64ToBytes(input.trim()));
    case "base64url-encode":
      return bytesToBase64(textEncoder.encode(input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    case "base64url-decode": {
      const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
      return textDecoder.decode(base64ToBytes(padded));
    }
    case "hex-encode":
    case "utf8-to-hex":
      return bytesToHex(textEncoder.encode(input));
    case "hex-decode":
    case "hex-to-utf8":
      return textDecoder.decode(hexToBytes(input));
    case "url-encode":
      return encodeURIComponent(input);
    case "url-decode":
      return decodeURIComponent(input);
  }
}

export function generateUuid(): string {
  return uuidv4();
}

export function generateRandomSalt(length = 16): string {
  return bytesToHex(randomBytes(length));
}
