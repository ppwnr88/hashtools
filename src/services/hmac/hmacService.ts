import CryptoJS from "crypto-js";

export type HmacAlgorithm = "HMAC-MD5" | "HMAC-SHA1" | "HMAC-SHA256" | "HMAC-SHA384" | "HMAC-SHA512";

export function calculateHmac(message: string, key: string, algorithm: HmacAlgorithm) {
  const method = {
    "HMAC-MD5": CryptoJS.HmacMD5,
    "HMAC-SHA1": CryptoJS.HmacSHA1,
    "HMAC-SHA256": CryptoJS.HmacSHA256,
    "HMAC-SHA384": CryptoJS.HmacSHA384,
    "HMAC-SHA512": CryptoJS.HmacSHA512,
  }[algorithm];
  const digest = method(message, key);
  return {
    hexLower: digest.toString(CryptoJS.enc.Hex),
    hexUpper: digest.toString(CryptoJS.enc.Hex).toUpperCase(),
    base64: digest.toString(CryptoJS.enc.Base64),
  };
}
