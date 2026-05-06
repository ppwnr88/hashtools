import { useMemo, useState } from "react";
import { identifyHash } from "../../services/hashIdentifier/hashIdentifierService";

export function HashIdentifierTool() {
  const [input, setInput] = useState("");
  const guesses = useMemo(() => identifyHash(input), [input]);

  return (
    <div className="tool-stack">
      <section className="panel">
        <textarea rows={7} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a hash or encoded digest..." />
        <p className="muted">This is a pattern-based guess, not 100% confirmation. Different algorithms can produce the same length and character set.</p>
      </section>
      <section className="result-grid">
        {guesses.map((guess) => (
          <article className="panel guess-card" key={`${guess.name}-${guess.reason}`}>
            <span className={`confidence ${guess.confidence.toLowerCase()}`}>{guess.confidence}</span>
            <h2>{guess.name}</h2>
            <p>{guess.reason}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
