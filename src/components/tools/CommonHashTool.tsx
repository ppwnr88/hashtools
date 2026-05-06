import { Clipboard, Download, Eraser, FileUp, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { HashResult, HistoryItem } from "../../types";
import { formatBytes } from "../../utils/bytes";
import { addHistory, clearHistory, getAutoCopy, getHistory, setAutoCopy } from "../../utils/history";
import { hashAlgorithms } from "../../services/hash/algorithms";
import { calculateHash } from "../../services/hash/hashService";
import { HistoryPanel } from "./HistoryPanel";
import { ResultBox } from "./ResultBox";

const groupMap: Record<string, string> = {
  sha: "SHA Family",
  sha3: "SHA3 / Keccak",
  checksum: "Checksum",
};

const quickAlgorithmIds = ["md5", "sha1", "sha256", "sha512", "crc32"];
const encoder = new TextEncoder();

export function CommonHashTool() {
  const [params] = useSearchParams();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(() => {
    const algo = params.get("algo");
    return algo && hashAlgorithms.some((item) => item.id === algo) ? algo : "sha512";
  });
  const [result, setResult] = useState<HashResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoCopy, setAutoCopyState] = useState(getAutoCopy());
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());

  const selectedMeta = hashAlgorithms.find((algo) => algo.id === selectedAlgorithm) || hashAlgorithms[0];
  const byteLength = file ? file.size : encoder.encode(text).length;
  const canGenerate = Boolean(text || file) && selectedMeta.available;
  const quickAlgorithms = quickAlgorithmIds.map((id) => hashAlgorithms.find((algo) => algo.id === id)).filter((algo): algo is NonNullable<typeof algo> => Boolean(algo));

  const visibleAlgorithms = useMemo(() => {
    const group = groupMap[params.get("group") || ""] || "";
    return hashAlgorithms.filter((algo) => {
      const matchesGroup = group ? algo.category === group : true;
      const matchesQuery = `${algo.label} ${algo.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [params, query]);

  const generate = useCallback(async () => {
    setError("");
    if (!text && !file) {
      setResult(null);
      return;
    }
    const algorithm = hashAlgorithms.find((algo) => algo.id === selectedAlgorithm);
    if (!algorithm?.available) {
      setResult(null);
      setError(`${algorithm?.label || "This algorithm"} is coming soon.`);
      return;
    }
    setLoading(true);
    try {
      const input = file ? new Uint8Array(await file.arrayBuffer()) : text;
      const next = await calculateHash(selectedAlgorithm, input);
      setResult(next);
      if (next.hexLower) setHistory(addHistory({ tool: "Hash", label: next.algorithmLabel, result: next.hexLower }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not calculate hash.");
    } finally {
      setLoading(false);
    }
  }, [file, selectedAlgorithm, text]);

  useEffect(() => {
    const handle = window.setTimeout(() => void generate(), 160);
    return () => window.clearTimeout(handle);
  }, [generate]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const editing = ["TEXTAREA", "INPUT"].includes(target.tagName);
      if (event.ctrlKey && event.key === "Enter") void generate();
      if (event.ctrlKey && event.key.toLowerCase() === "c" && !editing && result?.hexLower) {
        event.preventDefault();
        void navigator.clipboard.writeText(result.hexLower);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate, result]);

  useEffect(() => {
    if (autoCopy && result?.hexLower) void navigator.clipboard.writeText(result.hexLower);
  }, [autoCopy, result]);

  function clearAll() {
    setText("");
    setFile(null);
    setResult(null);
    setError("");
  }

  async function copyPrimary() {
    if (result?.hexLower) await navigator.clipboard.writeText(result.hexLower);
  }

  function downloadPrimary() {
    if (!result?.hexLower) return;
    const blob = new Blob([`${result.algorithmLabel}\n${result.hexLower}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.algorithmId}-hash.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tool-stack">
      <section className="panel quick-hash-panel">
        <div className="quick-tabs" aria-label="Quick hash algorithms">
          {quickAlgorithms.map((algo) => (
            <button key={algo.id} type="button" className={selectedAlgorithm === algo.id ? "active" : ""} onClick={() => setSelectedAlgorithm(algo.id)}>
              {algo.label}
            </button>
          ))}
        </div>

        <textarea className="quick-input" value={text} onChange={(event) => { setText(event.target.value); setFile(null); }} placeholder={`Enter text to generate ${selectedMeta.label} hash...`} rows={9} />

        <div className="quick-status">
          <span>{byteLength} bytes</span>
          <strong>{selectedMeta.label}</strong>
          {loading && <em>Calculating locally...</em>}
        </div>

        <div className="primary-result">
          <code>{result?.hexLower || "..."}</code>
          {!canGenerate && <p>Enter text above or upload a file to generate a hash.</p>}
        </div>

        <div className="tool-actions quick-actions">
          <button type="button" className="secondary-btn" onClick={clearAll}><Eraser size={16} /> Clear</button>
          <button type="button" className="primary-btn" onClick={copyPrimary} disabled={!result?.hexLower}><Clipboard size={16} /> Copy</button>
          <button type="button" className="secondary-btn" onClick={downloadPrimary} disabled={!result?.hexLower}><Download size={16} /> Download .txt</button>
          <label className="switch"><input type="checkbox" checked={autoCopy} onChange={(event) => { setAutoCopyState(event.target.checked); setAutoCopy(event.target.checked); }} /> Auto copy</label>
        </div>

        <div className="tool-actions">
          <label className="file-button"><FileUp size={16} /> Upload file<input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
          {file && <span className="file-meta">{file.name} · {formatBytes(file.size)}</span>}
        </div>
        {error && <div className="status error">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>More algorithms</h2>
          <span className="muted">Choose one algorithm at a time for a cleaner result.</span>
        </div>
        <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithm..." /></div>
        <div className="algorithm-grid">
          {visibleAlgorithms.map((algo) => (
            <button key={algo.id} type="button" className={`algorithm-card ${selectedAlgorithm === algo.id ? "selected" : ""}`} disabled={!algo.available} onClick={() => setSelectedAlgorithm(algo.id)}>
              <span>{algo.label}</span>
              <small>{algo.description}</small>
              <em>{algo.available ? algo.category : "Coming soon"}</em>
              {algo.warning && <strong>{algo.warning}</strong>}
              <small>Best: {algo.bestFor}</small>
              <small>Avoid: {algo.avoidFor}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Output formats</h2>
        <ResultBox label="hex lowercase" value={result?.hexLower || ""} />
        <ResultBox label="hex uppercase" value={result?.hexUpper || ""} />
        {selectedMeta.outputFormats.includes("base64") && <ResultBox label="base64" value={result?.base64 || ""} />}
      </section>
      <HistoryPanel history={history} onClear={() => { clearHistory(); setHistory([]); }} />
    </div>
  );
}
