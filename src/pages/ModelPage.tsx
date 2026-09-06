import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { loadModel, promptIndexUrl, withRunQuery } from "../lib/api";
import type { ModelJson, ModelPromptRef } from "../lib/types";

const MAX_PROMPTS_PER_CATEGORY = 3;

function groupByCategory(prompts: ModelPromptRef[]): { category: string; prompts: ModelPromptRef[] }[] {
  const order: string[] = [];
  const map = new Map<string, ModelPromptRef[]>();
  for (const p of prompts) {
    const cat = p.category || "uncategorized";
    if (!map.has(cat)) {
      map.set(cat, []);
      order.push(cat);
    }
    const bucket = map.get(cat)!;
    if (bucket.length < MAX_PROMPTS_PER_CATEGORY) bucket.push(p);
  }
  return order.map((category) => ({ category, prompts: map.get(category)! }));
}

export default function ModelPage() {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const runId = searchParams.get("run");
  const [model, setModel] = useState<ModelJson | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [indexFailed, setIndexFailed] = useState(false);

  useEffect(() => {
    setIndexFailed(false);
    loadModel(slug).then(setModel).catch((e) => setErr(String(e)));
  }, [slug]);

  const grouped = useMemo(
    () => (model ? groupByCategory(model.prompts) : []),
    [model],
  );

  if (err) return <p className="err">{err}</p>;
  if (!model) return <p className="muted">Loading…</p>;

  const indexSrc = promptIndexUrl(slug, model.promptIndex?.path ?? "prompt-index.html");
  const effectiveRun = runId || model.runId;

  return (
    <div className="layout-model">
      <section>
        <p className="meta">
          <Link to={withRunQuery("/", effectiveRun)}>← All models</Link>
          {effectiveRun ? (
            <>
              {" · run "}
              <code>{effectiveRun}</code>
            </>
          ) : null}
        </p>
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
        <h3 style={{ marginTop: 0 }}>Prompts by category</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Showing up to {MAX_PROMPTS_PER_CATEGORY} prompts per category (public site acceptance).
        </p>
        {grouped.map(({ category, prompts }) => (
          <div key={category} className="category-block">
            <h4 className="category-heading">{category}</h4>
            <ul className="prompt-list">
              {prompts.map((p) => (
                <li key={p.id}>
                  <Link to={withRunQuery(`/models/${slug}/prompts/${p.id}`, effectiveRun)}>
                    <span>{p.title}</span>
                    <span className="score" style={{ fontSize: "1.1rem" }}>
                      {p.overall ?? "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="meta" style={{ marginTop: "1rem" }}>
          Links inside the iframe use <code>./prompts/&lt;id&gt;</code>; the site list
          above is the reliable navigation for SPA routing.
        </p>
      </aside>
    </div>
  );
}
