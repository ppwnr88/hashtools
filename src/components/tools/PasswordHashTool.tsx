import { KeyRound, RefreshCw } from "lucide-react";
import { useState } from "react";
import { argon2idHash, argon2VerifyPassword, bcryptHash, bcryptVerifyPassword, derivePbkdf2, generateSaltHex } from "../../services/password/passwordService";
import { ResultBox } from "./ResultBox";

export function PasswordHashTool() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState(generateSaltHex(16));
  const [cost, setCost] = useState(10);
  const [hash, setHash] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState("");
  const [pbkdf2, setPbkdf2] = useState({ iterations: 100000, keyLength: 32, digest: "SHA-256" as "SHA-1" | "SHA-256" | "SHA-512" });
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function run(task: "bcrypt" | "argon2" | "verify-bcrypt" | "verify-argon2") {
    setError("");
    setLoading(task);
    try {
      if (task === "bcrypt") setHash(await bcryptHash(password, salt, cost));
      if (task === "argon2") setHash(await argon2idHash(password, salt));
      if (task === "verify-bcrypt") setVerifyResult((await bcryptVerifyPassword(password, verifyHash)) ? "Match" : "No match");
      if (task === "verify-argon2") setVerifyResult((await argon2VerifyPassword(password, verifyHash)) ? "Match" : "No match");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password operation failed.");
    } finally {
      setLoading("");
    }
  }

  const pbkdf2Output = password ? derivePbkdf2(password, salt, pbkdf2.iterations, pbkdf2.keyLength, pbkdf2.digest) : "";

  return (
    <div className="tool-stack">
      <section className="warning-card"><KeyRound size={18} /> Password hashing is not the same as a normal hash. Do not use real passwords on devices you do not trust.</section>
      <section className="panel">
        <div className="field-grid">
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password..." /></label>
          <label>Salt hex<input value={salt} onChange={(event) => setSalt(event.target.value)} /></label>
        </div>
        <div className="tool-actions">
          <button type="button" className="secondary-btn" onClick={() => setSalt(generateSaltHex(16))}><RefreshCw size={16} /> Generate salt</button>
          <label>bcrypt cost<input type="number" min={4} max={15} value={cost} onChange={(event) => setCost(Number(event.target.value))} /></label>
        </div>
        <div className="tool-actions">
          <button type="button" className="primary-btn" onClick={() => void run("bcrypt")}>bcrypt hash</button>
          <button type="button" className="primary-btn cyan" onClick={() => void run("argon2")}>Argon2id hash</button>
        </div>
        {loading && <div className="status loading">Working locally: {loading}</div>}
        {error && <div className="status error">{error}</div>}
      </section>
      <ResultBox label="password hash" value={hash} />
      <section className="panel">
        <h2>Verify mode</h2>
        <textarea value={verifyHash} onChange={(event) => setVerifyHash(event.target.value)} rows={4} placeholder="Paste bcrypt or Argon2 encoded hash..." />
        <div className="tool-actions">
          <button type="button" className="secondary-btn" onClick={() => void run("verify-bcrypt")}>Verify bcrypt</button>
          <button type="button" className="secondary-btn" onClick={() => void run("verify-argon2")}>Verify Argon2</button>
          <strong className="verify-result">{verifyResult}</strong>
        </div>
      </section>
      <section className="panel">
        <h2>PBKDF2 derive key</h2>
        <div className="field-grid three">
          <label>Iterations<input type="number" value={pbkdf2.iterations} onChange={(event) => setPbkdf2({ ...pbkdf2, iterations: Number(event.target.value) })} /></label>
          <label>Key length bytes<input type="number" value={pbkdf2.keyLength} onChange={(event) => setPbkdf2({ ...pbkdf2, keyLength: Number(event.target.value) })} /></label>
          <label>Digest<select value={pbkdf2.digest} onChange={(event) => setPbkdf2({ ...pbkdf2, digest: event.target.value as typeof pbkdf2.digest })}><option>SHA-1</option><option>SHA-256</option><option>SHA-512</option></select></label>
        </div>
        <ResultBox label="PBKDF2 hex" value={pbkdf2Output} />
      </section>
    </div>
  );
}
