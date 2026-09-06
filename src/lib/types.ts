export type ManifestModel = {
  slug: string;
  displayName: string;
  vendor: string;
  snapshot: string;
  runId: string;
  summaryScore: number | null;
  promptCount: number;
  status: string;
};

export type Manifest = {
  schemaVersion: string;
  generatedAt: string;
  gauntletId: string;
  models: ManifestModel[];
};

export type ModelPromptRef = {
  id: string;
  title: string;
  category: string;
  href: string;
  overall: number | null;
  status: string;
};

export type ModelJson = {
  slug: string;
  displayName: string;
  vendor: string;
  snapshot: string;
  runId: string;
  startedAt?: string;
  effort?: string;
  temperature?: number;
  notes?: string;
  promptIndex?: { path: string; authoredByModel: boolean; title?: string };
  categories: string[];
  prompts: ModelPromptRef[];
};

export type PromptResult = {
  id: string;
  category: string;
  title: string;
  promptRef?: string;
  promptExcerpt?: string;
  promptPublic?: boolean;
  promptText?: string;
  fixture?: string | null;
  modelOutput: string;
  scores: {
    overall: number;
    dimensions: { id: string; label: string; score: number; max: number }[];
  };
  graderNotes?: string;
  grader?: string;
  scoredAt?: string;
};
