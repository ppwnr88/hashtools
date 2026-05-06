import { Check, Clipboard, Download } from "lucide-react";
import { useEffect, useState } from "react";

type ResultBoxProps = {
  label: string;
  value: string;
  autoCopy?: boolean;
  onCopied?: () => void;
};

export function ResultBox({ label, value, autoCopy, onCopied }: ResultBoxProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), 1300);
  }

  function download() {
    const blob = new Blob([`${label}\n${value}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (autoCopy && value) void navigator.clipboard.writeText(value);
  }, [value, autoCopy]);

  return (
    <div className="result-box">
      <div className="result-head">
        <span>{label}</span>
        <div className="icon-row">
          <button className="icon-btn" type="button" onClick={copy} title="Copy result">
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </button>
          <button className="icon-btn" type="button" onClick={download} title="Download result">
            <Download size={16} />
          </button>
        </div>
      </div>
      <pre>{value || "Waiting for input..."}</pre>
    </div>
  );
}
