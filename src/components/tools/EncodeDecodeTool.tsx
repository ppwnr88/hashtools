import { Copy, FileUp, RefreshCw } from "lucide-react";
import type { DragEvent } from "react";
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

type FilePreview = {
  base64: string;
  dataUrl: string;
  mimeType: string;
  fileName?: string;
  fileSize?: number;
};

const mimeSignatures: Array<{ mime: string; signatures: string[] }> = [
  { mime: "application/pdf", signatures: ["JVBERi0"] },
  { mime: "image/png", signatures: ["iVBORw0KGgo"] },
  { mime: "image/jpeg", signatures: ["/9j/"] },
  { mime: "image/gif", signatures: ["R0lGOD"] },
  { mime: "image/webp", signatures: ["UklGR"] },
  { mime: "image/svg+xml", signatures: ["PHN2Zy", "PD94bWwg"] },
  { mime: "text/plain", signatures: ["SGVsbG8", "VGhpcy", "eyJ"] },
];

function parseBase64Input(value: string): FilePreview | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const dataUrlMatch = trimmed.match(/^data:([^;,]+)?(?:;[^,]*)?;base64,(.+)$/s);
  const mimeType = dataUrlMatch?.[1] || detectMimeFromBase64(dataUrlMatch?.[2] || trimmed);
  const base64 = (dataUrlMatch?.[2] || trimmed).replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) return null;
  return {
    base64,
    mimeType,
    dataUrl: `data:${mimeType};base64,${base64}`,
  };
}

function detectMimeFromBase64(base64: string): string {
  const clean = base64.replace(/\s+/g, "");
  return mimeSignatures.find((item) => item.signatures.some((signature) => clean.startsWith(signature)))?.mime || "application/octet-stream";
}

function formatFileSize(size?: number): string {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function EncodeDecodeTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EncodingMode>("base64-encode");
  const [generated, setGenerated] = useState("");
  const [base64FileInput, setBase64FileInput] = useState("");
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [fileError, setFileError] = useState("");
  const encoded = useMemo(() => {
    try {
      return { output: input ? runEncoding(mode, input) : "", error: "" };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Could not encode or decode." };
    }
  }, [input, mode]);

  const pastedPreview = useMemo(() => parseBase64Input(base64FileInput), [base64FileInput]);
  const activePreview = filePreview || pastedPreview;

  async function loadFile(file: File) {
    setFileError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.readAsDataURL(file);
      });
      const parsed = parseBase64Input(dataUrl);
      if (!parsed) throw new Error("Could not convert file to Base64.");
      setFilePreview({
        ...parsed,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || parsed.mimeType,
        dataUrl: dataUrl.replace(/^data:[^;,]+/, `data:${file.type || parsed.mimeType}`),
      });
      setBase64FileInput("");
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Could not read file.");
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  }

  return (
    <div className="tool-stack">
      <section className="panel">
        <div className="panel-head">
          <h2>Mode</h2>
          <span className="muted">Choose a conversion mode before entering text.</span>
        </div>
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
      <section className="panel">
        <div className="panel-head">
          <h2>Base64 file viewer</h2>
          <span className="muted">Drag a file or paste Base64/Data URL to preview it locally.</span>
        </div>
        <label
          className="drop-zone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <FileUp size={22} />
          <strong>Drop image, PDF, text, or any file here</strong>
          <span>File content is converted to Base64 in your browser only.</span>
          <input type="file" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void loadFile(file);
          }} />
        </label>
        <textarea
          rows={5}
          value={base64FileInput}
          onChange={(event) => { setBase64FileInput(event.target.value); setFilePreview(null); }}
          placeholder="Paste Base64 or data:image/png;base64,..."
        />
        {fileError && <div className="status error">{fileError}</div>}
        {activePreview && (
          <div className="preview-grid">
            <div className="preview-frame">
              {activePreview.mimeType.startsWith("image/") && <img src={activePreview.dataUrl} alt={activePreview.fileName || "Base64 preview"} />}
              {activePreview.mimeType === "application/pdf" && <iframe title="PDF preview" src={activePreview.dataUrl} />}
              {activePreview.mimeType.startsWith("text/") && <iframe title="Text preview" src={activePreview.dataUrl} />}
              {!activePreview.mimeType.startsWith("image/") && activePreview.mimeType !== "application/pdf" && !activePreview.mimeType.startsWith("text/") && (
                <div className="generic-file-preview">
                  <FileUp size={32} />
                  <strong>Preview unavailable</strong>
                  <span>This file type can still be copied or downloaded as Base64.</span>
                </div>
              )}
            </div>
            <div className="preview-meta">
              <h2>{activePreview.fileName || "Detected Base64 payload"}</h2>
              <p><strong>MIME:</strong> {activePreview.mimeType}</p>
              {activePreview.fileSize !== undefined && <p><strong>Size:</strong> {formatFileSize(activePreview.fileSize)}</p>}
              <ResultBox label="data URL" value={activePreview.dataUrl} />
              <ResultBox label="base64" value={activePreview.base64} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
