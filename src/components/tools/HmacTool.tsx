import { useMemo, useState } from "react";
import { calculateHmac, type HmacAlgorithm } from "../../services/hmac/hmacService";
import { ResultBox } from "./ResultBox";

const algorithms: HmacAlgorithm[] = ["HMAC-MD5", "HMAC-SHA1", "HMAC-SHA256", "HMAC-SHA384", "HMAC-SHA512"];

export function HmacTool() {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("HMAC-SHA256");
  const result = useMemo(() => (message || key ? calculateHmac(message, key, algorithm) : null), [message, key, algorithm]);

  return (
    <div className="tool-stack">
      <section className="panel">
        <div className="field-grid">
          <label>Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={7} placeholder="Message to sign..." /></label>
          <label>Secret key<textarea value={key} onChange={(event) => setKey(event.target.value)} rows={7} placeholder="Secret key..." /></label>
        </div>
        <div className="segmented">
          {algorithms.map((item) => <button key={item} className={item === algorithm ? "active" : ""} onClick={() => setAlgorithm(item)} type="button">{item}</button>)}
        </div>
      </section>
      <section className="panel">
        <h2>{algorithm} output</h2>
        <ResultBox label="hex lowercase" value={result?.hexLower || ""} />
        <ResultBox label="hex uppercase" value={result?.hexUpper || ""} />
        <ResultBox label="base64" value={result?.base64 || ""} />
      </section>
    </div>
  );
}
