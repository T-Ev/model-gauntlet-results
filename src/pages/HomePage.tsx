import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listRuns, loadManifest, modelsForRun, resolveRunId, withRunQuery } from "../lib/api";
import type { Manifest } from "../lib/types";

export default function HomePage() {
  const [data, setData] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadManifest().then(setData).catch((e) => setErr(String(e)));
  }, []);

  const runs = useMemo(() => (data ? listRuns(data) : []), [data]);
  const selectedRun = useMemo(
    () => (data ? resolveRunId(data, searchParams.get("run")) : ""),
    [data, searchParams],
  );
  const models = useMemo(
    () => (data && selectedRun ? modelsForRun(data, selectedRun) : []),
    [data, selectedRun],
  );

  // Keep URL shareable: write default/resolved run into ?run= when missing or invalid
  useEffect(() => {
    if (!data || !selectedRun) return;
    const current = searchParams.get("run");
    if (current !== selectedRun) {
      const next = new URLSearchParams(searchParams);
      next.set("run", selectedRun);
      setSearchParams(next, { replace: true });
    }
  }, [data, selectedRun, searchParams, setSearchParams]);

  function onRunChange(runId: string) {
    const next = new URLSearchParams(searchParams);
    next.set("run", runId);
    setSearchParams(next);
  }

  if (err) return <p className="err">{err}</p>;
  if (!data) return <p className="muted">Loading models…</p>;

  const selectedMeta = runs.find((r) => r.id === selectedRun);

  return (
    <div>
      <div className="run-bar">
        <label className="run-selector" htmlFor="run-select">
          <span className="run-label">Run</span>
          <select
            id="run-select"
            value={selectedRun}
            onChange={(e) => onRunChange(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        {selectedMeta ? (
          <span className="meta run-meta">
            <code>{selectedMeta.id}</code>
            {selectedMeta.generatedAt ? ` · ${selectedMeta.generatedAt}` : ""}
          </span>
        ) : null}
      </div>

      <p className="muted">
        Index of models tested in the gauntlet. Click a model to open its{" "}
        <strong>model-authored</strong> prompt index (when present), then drill into
        scored prompts (up to 3 visible per category). Generated {data.generatedAt}. Schema{" "}
        {data.schemaVersion}.
      </p>

      {models.length === 0 ? (
        <p className="muted" style={{ marginTop: "1.25rem" }}>
          No models published for this run yet.
        </p>
      ) : (
        <div className="grid" style={{ marginTop: "1.25rem" }}>
          {models.map((m) => (
            <Link
              className="card"
              key={`${m.runId}-${m.slug}`}
              to={withRunQuery(`/models/${m.slug}`, selectedRun)}
            >
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
      )}
    </div>
  );
}
