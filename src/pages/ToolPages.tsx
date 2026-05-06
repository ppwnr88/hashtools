import { useEffect } from "react";
import { CommonHashTool } from "../components/tools/CommonHashTool";
import { EncodeDecodeTool } from "../components/tools/EncodeDecodeTool";
import { HashIdentifierTool } from "../components/tools/HashIdentifierTool";
import { HmacTool } from "../components/tools/HmacTool";
import { PasswordHashTool } from "../components/tools/PasswordHashTool";
import { ToolChrome } from "../components/tools/ToolChrome";
import { setMeta } from "../utils/seo";

const description = "Free online hash generator, checksum calculator, HMAC, bcrypt, Argon2, Base64, Hex, and hash identifier tools.";

function useToolMeta(title: string) {
  useEffect(() => setMeta(`${title} - Wannarat Hash Tools`, description), [title]);
}

export function HomePage() {
  useToolMeta("Online Hash Generator & Encoder");
  return (
    <ToolChrome title="Wannarat Hash Tools" kicker="terminal-grade browser utilities">
      <section className="home-grid">
        <a className="home-tile" href="/tools/hash"><span>#</span><h2>Hash and checksum</h2><p>Generate MD5, SHA, SHA3, Keccak, BLAKE, CRC32, and Adler-32 from text or files.</p></a>
        <a className="home-tile" href="/tools/hmac"><span>&gt;_</span><h2>HMAC signatures</h2><p>Create keyed message digests for API debugging and webhook verification examples.</p></a>
        <a className="home-tile" href="/tools/password-hash"><span>$</span><h2>Password hashing</h2><p>Try bcrypt, Argon2id, verification mode, salts, cost settings, and PBKDF2 derivation.</p></a>
        <a className="home-tile" href="/tools/encode-decode"><span>01</span><h2>Encode and decode</h2><p>Convert Base64, Base64URL, Hex, URL encoding, UTF-8 bytes, UUIDs, and random salts.</p></a>
      </section>
    </ToolChrome>
  );
}

export function HashPage() {
  useToolMeta("Hash Generator");
  return <ToolChrome title="Common Hash Tool" kicker="hash / checksum"><CommonHashTool /></ToolChrome>;
}

export function HmacPage() {
  useToolMeta("HMAC Generator");
  return <ToolChrome title="HMAC Tool" kicker="keyed message digest"><HmacTool /></ToolChrome>;
}

export function PasswordHashPage() {
  useToolMeta("Password Hash Generator");
  return <ToolChrome title="Password Hash Tool" kicker="bcrypt / argon2id / pbkdf2"><PasswordHashTool /></ToolChrome>;
}

export function EncodeDecodePage() {
  useToolMeta("Encode Decode");
  return <ToolChrome title="Encode / Decode Tool" kicker="base64 / hex / url / uuid"><EncodeDecodeTool /></ToolChrome>;
}

export function HashIdentifierPage() {
  useToolMeta("Hash Identifier");
  return <ToolChrome title="Hash Identifier" kicker="pattern-based hash guesser"><HashIdentifierTool /></ToolChrome>;
}
