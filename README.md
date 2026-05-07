# Wannarat Hash Tools

Premium terminal-style developer utilities for hash, checksum, HMAC, password hashing, encoding/decoding, and hash identification.

## Features

- Client-side only React + TypeScript + Vite static app
- Common hash algorithms: MD5, SHA-1, SHA-2, SHA-3, Keccak, RIPEMD-160, BLAKE2, BLAKE3, CRC32, Adler-32
- HMAC MD5/SHA1/SHA256/SHA384/SHA512
- bcrypt, Argon2id, PBKDF2, verify mode, salt generation, cost settings
- Base64, Base64URL, Hex, URL encode/decode, UTF-8 bytes, UUID v4, random salt
- Pattern-based hash identifier
- LocalStorage history and auto-copy toggle
- Responsive sidebar and mobile bottom navigation
- SEO pages, blog content, sitemap, and robots

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Deploy to Vercel

Import `https://github.com/ppwnr88/hashtools.git` in Vercel.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Environment Variables

- `VITE_SITE_URL`: canonical production URL, for example `https://your-domain.com`

## Privacy Note

All calculations run locally in the browser. The app does not upload or store user text, files, passwords, or keys on a server. History is stored only in the current browser's `localStorage`.

## Library Credits

- `hash-wasm` for browser-friendly hashing, bcrypt, Argon2, CRC, and BLAKE algorithms
- `crypto-js` for HMAC and PBKDF2 helpers
- `uuid` for UUID v4 generation
- `lucide-react` for icons
- React, TypeScript, and Vite
