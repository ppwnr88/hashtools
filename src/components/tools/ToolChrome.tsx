import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ToolChromeProps = {
  title: string;
  kicker: string;
  children: ReactNode;
};

export function ToolChrome({ title, kicker, children }: ToolChromeProps) {
  return (
    <>
      <section className="hero-band">
        <p className="terminal-prompt"># {kicker}</p>
        <h1>{title}</h1>
        <p>
          Popular and commonly used hash algorithms, encoders, and verification helpers. Everything runs locally in your browser, with no server-side processing of your input.
        </p>
      </section>
      {children}
      <section className="info-grid">
        <article>
          <h2>What is this?</h2>
          <p>This tool helps developers calculate, transform, or inspect data without sending text, files, passwords, or keys away from the current browser session.</p>
        </article>
        <article>
          <h2>When to use?</h2>
          <p>Use it for debugging API signatures, comparing checksums, preparing examples, verifying downloaded files, or learning how common digest formats look.</p>
        </article>
        <article>
          <h2>Is it safe?</h2>
          <p>The calculation is client-side only. For highly sensitive production secrets, still prefer trusted devices, locked screens, and audited internal tooling.</p>
        </article>
        <article>
          <h2>FAQ</h2>
          <p>MD5 and SHA-1 are kept for compatibility and checksum work, not for modern security. Passwords need bcrypt, Argon2, PBKDF2, or another password hashing scheme.</p>
        </article>
      </section>
      <section className="related-links">
        <Link to="/tools/hash">Hash generator</Link>
        <Link to="/tools/hmac">HMAC</Link>
        <Link to="/tools/password-hash">Password hash</Link>
        <Link to="/blog/how-to-verify-file-integrity">File integrity guide</Link>
      </section>
    </>
  );
}
