import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadManifest } from "../lib/api";
import type { Manifest } from "../lib/types";

export default function HomePage() {
  const [data, setData] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadManifest().then(setData).catch((e) => setErr(String(e)));
  }, []);

  if (err) return <p className="err">{err}</p>;
  if (!data) return <p className="muted">Loading models…</p>;

  return (
    <div>
      <p className="muted">
        Index of models tested in the gauntlet. Click a model to open its{" "}
        <strong>model-authored</strong> prompt index (when present), then drill into
        scored prompts. Generated {data.generatedAt}. Schema {data.schemaVersion}.
      </p>
      <div className="grid" style={{ marginTop: "1.25rem" }}>
        {data.models.map((m) => (
          <Link className="card" key={m.slug} to={`/models/${m.slug}`}>
            <div className="pill">{m.vendor}</div>
            <h2>{m.displayName}</h2>
            <div className="score">{m.summaryScore ?? "—"}</div>
            <div className="meta">
              {m.promptCount} prompts · {m.status}
              <br />
              <code>{m.snapshot}</code>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
