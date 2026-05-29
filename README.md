# Punch — Tamagotchi

Feed, play with, and rest Punch the monkey. Built as a PWA so it survives the homescreen-add experience on iOS without an App Store cycle.

This repo is the **target** of the [giga-mcp-server](https://github.com/gigadude1982/giga-mcp-server) (Bender) autonomous pipeline. Tickets in the JIRA `PUNCH` project drive PRs into this repo via the multi-stage agent pipeline.

## Stack

- Vite + React + TypeScript
- PWA via `vite-plugin-pwa` (manifest + service worker, autoUpdate)
- Jest + @testing-library/react (Jest, not Vitest — the agent prompts are Jest-tuned)
- Framer Motion for transitions
- DOM/CSS rendering, no canvas in v1

## Local dev

```bash
nvm use 20            # Node ≥18 required
npm install
npm run dev           # vite dev server
npm test              # jest
npm run build         # production bundle
npm run preview       # preview the production bundle
```

## Pipeline config

See `.giga-pipeline.json` — locks language/test framework/branch prefix for Bender's agents. Bender also picks up `.prettierrc` and `.eslintrc.cjs` automatically and inlines them into the implementer's coding-standards context.

## Design decisions

See [`PUNCH-TAMAGOTCHI-PLAN.md` in the giga-mcp-server repo](https://github.com/gigadude1982/giga-mcp-server/blob/main/PUNCH-TAMAGOTCHI-PLAN.md) for the v1 design lock-in (🐒 baby / 🦧 evolved sprites, session-based decay, hunger+happiness+energy stats, evolution gated on streak).
