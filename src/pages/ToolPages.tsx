import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CommonHashTool } from "../components/tools/CommonHashTool";
import { EncodeDecodeTool } from "../components/tools/EncodeDecodeTool";
import { HashIdentifierTool } from "../components/tools/HashIdentifierTool";
import { HmacTool } from "../components/tools/HmacTool";
import { PasswordHashTool } from "../components/tools/PasswordHashTool";
import { ToolChrome } from "../components/tools/ToolChrome";
import { hashAlgorithms } from "../services/hash/algorithms";
import { setMeta } from "../utils/seo";

const description = "Free online hash generator, checksum calculator, HMAC, bcrypt, Argon2, Base64, Hex, and hash identifier tools.";

function useToolMeta(title: string) {
  useEffect(() => setMeta(`${title} - Wannarat Hash Tools`, description), [title]);
}

const toolDirectory = [
  { title: "MD5 hash", tag: "Legacy checksum", path: "/tools/hash?algo=md5", icon: "#", summary: "Generate MD5 from text or files for compatibility checks. Not for security." },
  { title: "SHA-1 hash", tag: "Legacy SHA", path: "/tools/hash?algo=sha1", icon: "S1", summary: "Create SHA-1 digests for older systems while seeing clear safety warnings." },
  { title: "SHA-256 hash", tag: "Recommended default", path: "/tools/hash?algo=sha256", icon: "S2", summary: "Use SHA-256 for file integrity, fingerprints, release checks, and API examples." },
  { title: "SHA-512 hash", tag: "Long digest", path: "/tools/hash?algo=sha512", icon: "S5", summary: "Generate 512-bit SHA-2 hashes with hex uppercase, lowercase, and Base64 output." },
  { title: "SHA3 / Keccak", tag: "Modern family", path: "/tools/hash?group=sha3", icon: "K3", summary: "Explore SHA3-224/256/384/512 and Keccak variants in one searchable tool." },
  { title: "CRC32 / Adler-32", tag: "Checksum", path: "/tools/hash?group=checksum", icon: "C", summary: "Fast checksums for accidental error detection and legacy file workflows." },
  { title: "BLAKE2 / BLAKE3", tag: "Fast modern hash", path: "/tools/hash?algo=blake3", icon: "B3", summary: "High-speed modern content hashes available directly in the browser." },
  { title: "HMAC generator", tag: "Secret key", path: "/tools/hmac", icon: "HK", summary: "Create HMAC-MD5, HMAC-SHA1, SHA256, SHA384, and SHA512 signatures." },
  { title: "bcrypt password", tag: "Password hash", path: "/tools/password-hash", icon: "$2", summary: "Hash and verify bcrypt with cost control and generated salt support." },
  { title: "Argon2id password", tag: "Memory-hard", path: "/tools/password-hash", icon: "A2", summary: "Create and verify Argon2id encoded hashes locally in the browser." },
  { title: "PBKDF2 derive key", tag: "KDF", path: "/tools/password-hash", icon: "PB", summary: "Tune iterations, key length, digest, and salt for PBKDF2 examples." },
  { title: "Base64 / Base64URL", tag: "Encode", path: "/tools/encode-decode", icon: "64", summary: "Encode and decode Base64 formats, including URL-safe payloads." },
  { title: "Hex / UTF-8 bytes", tag: "Bytes", path: "/tools/encode-decode", icon: "0x", summary: "Convert text to hex bytes and hex bytes back to UTF-8 text." },
  { title: "URL encode/decode", tag: "Web utility", path: "/tools/encode-decode", icon: "%", summary: "Convert query-safe strings with encodeURIComponent-compatible behavior." },
  { title: "UUID and salt", tag: "Generator", path: "/tools/encode-decode", icon: "ID", summary: "Generate UUID v4 values and random salts without network requests." },
  { title: "Hash identifier", tag: "Detect", path: "/tools/hash-identifier", icon: "?", summary: "Guess MD5, SHA, bcrypt, Argon2, hex-like, and Base64-like hashes by pattern." },
];

const comparisonRows = [
  ["File integrity", "SHA-256 / SHA-512", "Use for downloads, releases, and build artifacts."],
  ["Legacy checksum", "MD5 / CRC32 / Adler-32", "Useful for compatibility; avoid for trust boundaries."],
  ["API signature", "HMAC-SHA256", "Adds a secret key so messages can be authenticated."],
  ["Password storage", "bcrypt / Argon2id", "Use salts and work factors; never store plain fast hashes."],
  ["Text transport", "Base64 / Hex / URL", "Encode data for logs, URLs, JSON, and debugging."],
];

export function HomePage() {
  useToolMeta("Online Hash Generator & Encoder");
  const [search, setSearch] = useState("");
  const filteredTools = useMemo(() => {
    const normalized = search.toLowerCase();
    return toolDirectory.filter((tool) => `${tool.title} ${tool.tag} ${tool.summary}`.toLowerCase().includes(normalized));
  }, [search]);
  const supportedCount = hashAlgorithms.filter((item) => item.available).length;

  return (
    <ToolChrome title="Wannarat Hash Tools" kicker="terminal-grade browser utilities">
      <section className="home-command panel">
        <div>
          <p className="terminal-prompt"># more tools, fewer clicks</p>
          <h2>Hash, checksum, HMAC, password hashing, encoding, and identifier tools in one local browser app.</h2>
        </div>
        <div className="home-stats">
          <strong>{supportedCount}+</strong><span>hash/checksum algorithms</span>
          <strong>0</strong><span>server uploads</span>
          <strong>5</strong><span>developer guides</span>
        </div>
      </section>

      <section className="panel tool-finder">
        <div className="panel-head">
          <h2>Find a tool</h2>
          <span className="muted">Faster than a plain link list, broader than the reference page.</span>
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search MD5, SHA-512, bcrypt, Base64, HMAC, CRC32..." />
        <div className="tool-directory">
          {filteredTools.map((tool) => (
            <Link className="directory-card" to={tool.path} key={tool.title}>
              <span className="directory-icon">{tool.icon}</span>
              <span className="directory-tag">{tool.tag}</span>
              <h2>{tool.title}</h2>
              <p>{tool.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Choose the right primitive</h2>
          <Link className="inline-link" to="/blog/what-is-hash-function">Read the guide</Link>
        </div>
        <div className="comparison-list">
          {comparisonRows.map(([job, pick, note]) => (
            <div className="comparison-row" key={job}>
              <strong>{job}</strong>
              <code>{pick}</code>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-grid">
        <Link className="home-tile featured" to="/tools/hash"><span>#</span><h2>Text and file hashing</h2><p>One fast workspace for MD5, SHA, SHA3, Keccak, BLAKE, CRC32, and Adler-32 with copy/download outputs.</p></Link>
        <Link className="home-tile" to="/tools/hmac"><span>&gt;_</span><h2>HMAC signatures</h2><p>Create keyed message digests for API debugging, webhook examples, and request signing tests.</p></Link>
        <Link className="home-tile" to="/tools/password-hash"><span>$</span><h2>Password hashing</h2><p>Try bcrypt, Argon2id, verification mode, salts, cost settings, and PBKDF2 derivation.</p></Link>
        <Link className="home-tile" to="/tools/hash-identifier"><span>?</span><h2>Hash identifier</h2><p>Paste an unknown hash and get pattern-based guesses with confidence and caveats.</p></Link>
      </section>
    </ToolChrome>
  );
}

export function HashPage() {
  useToolMeta("Hash Generator");
  return <ToolChrome title="Hash / Checksum Tool" kicker="popular hash algorithms"><CommonHashTool /></ToolChrome>;
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
