# model-gauntlet-results

Public site for model gauntlet scores. Private prompts and rubrics live in [`model-gauntlet`](https://github.com/T-Ev/model-gauntlet).

## Live site

**https://t-ev.github.io/model-gauntlet-results/**

## Routes

- `/` — model index (pick a run via the dropdown; shareable as `?run=<runId>`)
- `/models/:slug` — that model’s prompt-index page (authored by the model)
- `/models/:slug/prompts/:id` — individual prompt result

Model and prompt links preserve `?run=` so deep links stay tied to the selected run.
Manifest `defaultRunId` / `runs[]` (schema 1.1.0) drive the picker; older flat manifests still work.

## Stack

Vite + React + TypeScript. Base path: `/model-gauntlet-results/`.

## Deploy (GitHub Pages)

Deployment is automatic via [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. On every push to `main` (or manual **workflow_dispatch**), the Action runs `npm ci` + `npm run build`.
2. It uploads `dist/` and deploys with `actions/deploy-pages`.

**One-time repo setting:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Local preview:

```bash
npm ci
npm run build
npm run preview
```
