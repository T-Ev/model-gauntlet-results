import type { Manifest, ModelJson, PromptResult } from "./types";

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
