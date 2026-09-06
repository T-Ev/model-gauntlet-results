import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { loadPrompt, withRunQuery } from "../lib/api";
import type { PromptResult } from "../lib/types";

export default function PromptPage() {
  const { slug = "", id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const runId = searchParams.get("run");
  const [data, setData] = useState<PromptResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadPrompt(slug, id).then(setData).catch((e) => setErr(String(e)));
  }, [slug, id]);

  if (err) return <p className="err">{err}</p>;
  if (!data) return <p className="muted">Loading prompt…</p>;

  const base = import.meta.env.BASE_URL;
  const fixtureSrc =
    data.fixture && data.fixture.startsWith("/")
      ? `${base}${data.fixture.replace(/^\//, "")}`
      : data.fixture
        ? `${base}${data.fixture}`
        : null;

  return (
    <article>
      <p className="meta">
        <Link to={withRunQuery(`/models/${slug}`, runId)}>← {slug}</Link>
        {runId ? (
          <>
            {" · run "}
            <code>{runId}</code>
          </>
        ) : null}
      </p>
      <p className="pill">{data.category}</p>
      <h2 style={{ marginTop: 0 }}>{data.title}</h2>
      <p className="score">{data.scores.overall}</p>

      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h3>Prompt</h3>
        {data.promptPublic && data.promptText ? (
          <pre className="out">{data.promptText}</pre>
        ) : (
          <>
            <p className="muted">
              Full prompt kept private (<code>promptPublic: false</code>). Excerpt:
            </p>
            <pre className="out">{data.promptExcerpt ?? "(no excerpt)"}</pre>
            {data.promptRef ? (
              <p className="meta">
                Private ref: <code>{data.promptRef}</code>
              </p>
            ) : null}
          </>
        )}
        {fixtureSrc ? (
          <div style={{ marginTop: "0.75rem" }}>
            <p className="meta">Fixture</p>
            <img className="fixture" src={fixtureSrc} alt={`Fixture for ${data.id}`} />
          </div>
        ) : null}
      </section>

      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h3>Model output</h3>
        <pre className="out">{data.modelOutput}</pre>
      </section>

      <section className="panel">
        <h3>Scores</h3>
        <table className="dims">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data.scores.dimensions.map((d) => (
              <tr key={d.id}>
                <td>{d.label}</td>
                <td>
                  {d.score}/{d.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.graderNotes ? (
          <p style={{ marginTop: "0.75rem" }}>
            <strong>Grader notes:</strong> {data.graderNotes}
          </p>
        ) : null}
        <p className="meta">
          {data.grader ? `Grader: ${data.grader}` : ""}
          {data.scoredAt ? ` · ${data.scoredAt}` : ""}
        </p>
      </section>
    </article>
  );
}
