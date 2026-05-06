import type { HistoryItem } from "../../types";

export function HistoryPanel({ history, onClear }: { history: HistoryItem[]; onClear: () => void }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Recent history</h2>
        <button className="tiny-btn" type="button" onClick={onClear}>Clear</button>
      </div>
      {history.length === 0 ? (
        <p className="muted">Recent non-sensitive results you copy or generate will appear here in localStorage.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-item" key={item.id}>
              <span>{item.tool}</span>
              <strong>{item.label}</strong>
              <code>{item.result.slice(0, 96)}{item.result.length > 96 ? "..." : ""}</code>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
