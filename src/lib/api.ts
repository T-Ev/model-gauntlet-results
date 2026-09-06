import type { Manifest, ManifestModel, ManifestRun, ModelJson, PromptResult } from "./types";

const base = import.meta.env.BASE_URL;

export async function loadManifest(): Promise<Manifest> {
  const res = await fetch(`${base}data/manifest.json`);
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  return res.json();
}

export async function loadModel(slug: string): Promise<ModelJson> {
  const res = await fetch(`${base}data/models/${slug}/model.json`);
  if (!res.ok) throw new Error(`model ${slug} ${res.status}`);
  return res.json();
}

export async function loadPrompt(slug: string, id: string): Promise<PromptResult> {
  const res = await fetch(`${base}data/models/${slug}/prompts/${id}.json`);
  if (!res.ok) throw new Error(`prompt ${id} ${res.status}`);
  return res.json();
}

export function promptIndexUrl(slug: string, path = "prompt-index.html"): string {
  return `${base}data/models/${slug}/${path}`;
}

/** Runs for the picker. Backward compatible when `runs` is missing. */
export function listRuns(manifest: Manifest): ManifestRun[] {
  if (manifest.runs && manifest.runs.length > 0) return manifest.runs;

  const seen = new Map<string, ManifestRun>();
  for (const m of manifest.models) {
    const id = m.runId || "default";
    if (!seen.has(id)) {
      seen.set(id, {
        id,
        label: id === "default" ? "Default" : id,
        generatedAt: manifest.generatedAt,
      });
    }
  }
  if (seen.size === 0) {
    return [{ id: "default", label: "Default", generatedAt: manifest.generatedAt }];
  }
  return [...seen.values()];
}

/** Resolve selected run: URL param → defaultRunId → first listed run. */
export function resolveRunId(manifest: Manifest, urlRun: string | null | undefined): string {
  const runs = listRuns(manifest);
  if (urlRun && runs.some((r) => r.id === urlRun)) return urlRun;
  if (manifest.defaultRunId && runs.some((r) => r.id === manifest.defaultRunId)) {
    return manifest.defaultRunId;
  }
  return runs[0]?.id ?? "default";
}

/** Models belonging to a run. If legacy manifest has no runs/runIds, return all. */
export function modelsForRun(manifest: Manifest, runId: string): ManifestModel[] {
  const hasExplicitRuns = Boolean(manifest.runs && manifest.runs.length > 0);
  const anyModelRunId = manifest.models.some((m) => Boolean(m.runId));
  if (!hasExplicitRuns && !anyModelRunId) return manifest.models;
  return manifest.models.filter((m) => (m.runId || "default") === runId);
}

/** Build a relative path that preserves ?run= for shareable links. */
export function withRunQuery(path: string, runId: string | null | undefined): string {
  if (!runId) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}run=${encodeURIComponent(runId)}`;
}
