import { Copy, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { generateRandomSalt, generateUuid, runEncoding, type EncodingMode } from "../../services/encoding/encodingService";
import { ResultBox } from "./ResultBox";

const modes: { value: EncodingMode; label: string }[] = [
  { value: "base64-encode", label: "Base64 encode" },
  { value: "base64-decode", label: "Base64 decode" },
  { value: "base64url-encode", label: "Base64URL encode" },
  { value: "base64url-decode", label: "Base64URL decode" },
  { value: "hex-encode", label: "Hex encode" },
  { value: "hex-decode", label: "Hex decode" },
  { value: "url-encode", label: "URL encode" },
  { value: "url-decode", label: "URL decode" },
  { value: "utf8-to-hex", label: "UTF-8 text to bytes" },
  { value: "hex-to-utf8", label: "Bytes/hex to UTF-8 text" },
];

export function EncodeDecodeTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EncodingMode>("base64-encode");
  const [generated, setGenerated] = useState("");
  const encoded = useMemo(() => {
    try {
      return { output: input ? runEncoding(mode, input) : "", error: "" };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Could not encode or decode." };
    }
  }, [input, mode]);

  return (
    <div className="tool-stack">
      <section className="panel">
        <div className="segmented wrap">
          {modes.map((item) => <button key={item.value} type="button" className={mode === item.value ? "active" : ""} onClick={() => setMode(item.value)}>{item.label}</button>)}
        </div>
        <textarea rows={8} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Input to encode or decode..." />
        {encoded.error && <div className="status error">{encoded.error}</div>}
      </section>
      <ResultBox label="output" value={encoded.output} />
      <section className="panel">
        <h2>Generators</h2>
        <div className="tool-actions">
          <button className="secondary-btn" type="button" onClick={() => setGenerated(generateUuid())}><Copy size={16} /> UUID v4</button>
          <button className="secondary-btn" type="button" onClick={() => setGenerated(generateRandomSalt(16))}><RefreshCw size={16} /> Random salt</button>
        </div>
        <ResultBox label="generated value" value={generated} />
      </section>
    </div>
  );
}
