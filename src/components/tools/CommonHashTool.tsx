import { Eraser, FileUp, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { HashResult, HistoryItem } from "../../types";
import { formatBytes } from "../../utils/bytes";
import { addHistory, clearHistory, getAutoCopy, getHistory, setAutoCopy } from "../../utils/history";
import { hashAlgorithms } from "../../services/hash/algorithms";
import { calculateManyHashes } from "../../services/hash/hashService";
import { HistoryPanel } from "./HistoryPanel";
import { ResultBox } from "./ResultBox";

const groupMap: Record<string, string> = {
  sha: "SHA Family",
  sha3: "SHA3 / Keccak",
  checksum: "Checksum",
};

export function CommonHashTool() {
  const [params] = useSearchParams();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["md5", "sha1", "sha256"]);
  const [results, setResults] = useState<HashResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoCopy, setAutoCopyState] = useState(getAutoCopy());
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());

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
    const availableSelected = selected.filter((id) => hashAlgorithms.find((algo) => algo.id === id)?.available);
    if (!text && !file) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const input = file ? new Uint8Array(await file.arrayBuffer()) : text;
      const next = await calculateManyHashes(availableSelected, input);
      setResults(next);
      if (next[0]?.hexLower) setHistory(addHistory({ tool: "Hash", label: next[0].algorithmLabel, result: next[0].hexLower }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not calculate hash.");
    } finally {
      setLoading(false);
    }
  }, [file, selected, text]);

  useEffect(() => {
    const handle = window.setTimeout(() => void generate(), 160);
    return () => window.clearTimeout(handle);
  }, [generate]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const editing = ["TEXTAREA", "INPUT"].includes(target.tagName);
      if (event.ctrlKey && event.key === "Enter") void generate();
      if (event.ctrlKey && event.key.toLowerCase() === "c" && !editing && results[0]?.hexLower) {
        event.preventDefault();
        void navigator.clipboard.writeText(results[0].hexLower);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate, results]);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="tool-stack">
      <section className="panel">
        <div className="panel-head">
          <h2>Input</h2>
          <label className="switch"><input type="checkbox" checked={autoCopy} onChange={(event) => { setAutoCopyState(event.target.checked); setAutoCopy(event.target.checked); }} /> Auto copy</label>
        </div>
        <textarea value={text} onChange={(event) => { setText(event.target.value); setFile(null); }} placeholder="Paste text to hash..." rows={8} />
        <div className="tool-actions">
          <label className="file-button"><FileUp size={16} /> Upload file<input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
          <button type="button" className="secondary-btn" onClick={() => { setText(""); setFile(null); setResults([]); }}><Eraser size={16} /> Clear</button>
          {file && <span className="file-meta">{file.name} · {formatBytes(file.size)}</span>}
        </div>
      </section>

      <section className="panel">
        <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithm..." /></div>
        <div className="algorithm-grid">
          {visibleAlgorithms.map((algo) => (
            <button key={algo.id} type="button" className={`algorithm-card ${selected.includes(algo.id) ? "selected" : ""}`} disabled={!algo.available} onClick={() => toggle(algo.id)}>
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

      {loading && <div className="status loading">Calculating locally...</div>}
      {error && <div className="status error">{error}</div>}
      <section className="result-grid">
        {results.map((result) => (
          <div className="panel" key={result.algorithmId}>
            <h2>{result.algorithmLabel}</h2>
            <ResultBox label="hex lowercase" value={result.hexLower || ""} autoCopy={autoCopy} />
            <ResultBox label="hex uppercase" value={result.hexUpper || ""} />
            {result.base64 && <ResultBox label="base64" value={result.base64} />}
          </div>
        ))}
      </section>
      <HistoryPanel history={history} onClear={() => { clearHistory(); setHistory([]); }} />
    </div>
  );
}
