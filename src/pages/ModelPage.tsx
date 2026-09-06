import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadModel, promptIndexUrl } from "../lib/api";
import type { ModelJson } from "../lib/types";

export default function ModelPage() {
  const { slug = "" } = useParams();
  const [model, setModel] = useState<ModelJson | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [indexFailed, setIndexFailed] = useState(false);

  useEffect(() => {
    setIndexFailed(false);
    loadModel(slug).then(setModel).catch((e) => setErr(String(e)));
  }, [slug]);

  if (err) return <p className="err">{err}</p>;
  if (!model) return <p className="muted">Loading…</p>;

  const indexSrc = promptIndexUrl(slug, model.promptIndex?.path ?? "prompt-index.html");

  return (
    <div className="layout-model">
      <section>
        <p className="pill">{model.vendor}</p>
        <h2 style={{ marginTop: 0 }}>{model.displayName}</h2>
        <p className="meta">
          Snapshot <code>{model.snapshot}</code> · run <code>{model.runId}</code>
          {model.effort ? ` · effort ${model.effort}` : ""}
          {model.temperature != null ? ` · T=${model.temperature}` : ""}
        </p>
        {model.notes ? <p className="muted">{model.notes}</p> : null}

        <h3>Model-authored prompt index</h3>
        {!indexFailed ? (
          <iframe
            className="index"
            title={model.promptIndex?.title ?? "Prompt index"}
            src={indexSrc}
            onError={() => setIndexFailed(true)}
          />
        ) : (
          <p className="muted">No prompt-index.html — using fallback list.</p>
        )}
        <p className="meta">
          Source: <code>{indexSrc}</code>
          {model.promptIndex?.authoredByModel ? " (authoredByModel: true)" : ""}
        </p>
      </section>

      <aside className="panel">
        <h3 style={{ marginTop: 0 }}>Prompts</h3>
        <ul className="prompt-list">
          {model.prompts.map((p) => (
            <li key={p.id}>
              <Link to={`/models/${slug}/prompts/${p.id}`}>
                <span>
                  <span className="pill">{p.category}</span>
                  <br />
                  {p.title}
                </span>
                <span className="score" style={{ fontSize: "1.1rem" }}>
                  {p.overall ?? "—"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="meta" style={{ marginTop: "1rem" }}>
          Links inside the iframe use <code>./prompts/&lt;id&gt;</code>; the site list
          above is the reliable navigation for SPA routing.
        </p>
      </aside>
    </div>
  );
}
