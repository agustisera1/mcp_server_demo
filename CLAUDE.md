# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # run in dev mode via tsx (reads .env)
npm run build      # compile TypeScript to build/, then run the output
```

There is no test runner or linter configured.

## Environment variables

When launched by an MCP client, the server receives env vars injected by the client process — no local `.env` needed. The local `.env` is only relevant when running the server standalone (`npm start` / `npm run build`).

| Variable | Purpose |
|---|---|
| `TMDB_API_KEY` | TMDB v3 API key — appended as `?api_key=` to every request |
| `TMDB_READ_ACCESS_TOKEN` | TMDB Bearer token — sent as `Authorization: Bearer` header if present |
| `TMDB_API_URL` | TMDB base URL (defaults to `https://api.themoviedb.org/3`) |

Both auth methods are supported simultaneously; at least one must be set.

## Architecture

This is a **TMDB MCP server** — an MCP (Model Context Protocol) server that exposes The Movie Database API as tools consumable by LLMs. It communicates over **stdin/stdout** using `StdioServerTransport`.

### Entry point: `src/index.ts`

All 9 tools are registered here with `server.registerTool(name, { description, inputSchema, outputSchema }, handler)`. Every handler calls `makeServiceRequest(serviceFn, args)`, which wraps the result in the MCP structured-content envelope `{ content: [], structuredContent: result }`.

### Tool registry: `src/lib/tools.ts`

`toolsMap` is the single source of truth for tool names (used as both the registration key and a typed constant). `makeServiceRequest` is the universal adapter between service functions and MCP tool handlers — add it to this file if a new tool-level utility is needed.

### Service layer: `src/lib/<feature>/`

Each feature owns two files:
- `service.ts` — async function(s) that call TMDB and return normalized data
- `service.types.ts` — Zod schemas for raw TMDB responses and TypeScript types for the normalized output

### Shared layer: `src/lib/shared/`

| File | Purpose |
|---|---|
| `http.ts` | `tmdbFetch` (typed fetch + Zod parse) and `buildQuery` (object → query string). Auth is read from env vars at runtime — `TMDB_API_KEY` as query param, `TMDB_READ_ACCESS_TOKEN` as Bearer header. |
| `media.ts` | Shared Zod schemas (`tmdbMediaItemSchema`, `PaginatedMediaResponseSchema`) and normalization helpers (`normalizeMediaItem`, `normalizePaginatedMedia`) |
| `types.ts` | Shared TypeScript union types (`ContentType`, `SortBy`, etc.) |

### Adding a new tool

1. Create `src/lib/<feature>/service.ts` and `service.types.ts` following existing patterns.
2. Add the tool name to `toolsMap` in `src/lib/tools.ts`.
3. Register the tool in `src/index.ts` using `makeServiceRequest`.

### Data flow

```
MCP client → stdin → server.registerTool handler
  → makeServiceRequest(serviceFn, args)
    → serviceFn calls tmdbFetch (raw TMDB response → Zod parse → normalize)
  → { content: [], structuredContent: normalizedResult } → stdout → MCP client
```
