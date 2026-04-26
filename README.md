# TMDB MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes [The Movie Database (TMDB) API](https://developer.themoviedb.org) as tools consumable by LLMs. Communicates over **stdin/stdout** using `StdioServerTransport`.

## Requirements

- Node.js 18+
- A TMDB API key and/or Read Access Token — get one at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

## Setup

```bash
npm install
```

Create a `.env` file (only needed when running standalone — MCP clients inject env vars automatically):

```env
TMDB_API_KEY=your_v3_api_key
TMDB_READ_ACCESS_TOKEN=your_bearer_token   # optional, but preferred
TMDB_API_URL=https://api.themoviedb.org/3  # optional, defaults to this value
```

At least one of `TMDB_API_KEY` or `TMDB_READ_ACCESS_TOKEN` must be set.

## Commands

```bash
npm start        # run in dev mode via tsx (reads .env)
npm run build    # compile TypeScript → build/, then run the output
```

## MCP Client Configuration

To wire this server into an MCP client (e.g. Claude Desktop), add it to your client's config:

```json
{
  "mcpServers": {
    "tmdb": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_server_demo/build/index.js"],
      "env": {
        "TMDB_API_KEY": "your_v3_api_key",
        "TMDB_READ_ACCESS_TOKEN": "your_bearer_token"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `get_genres` | List TMDB genres for movies or TV shows |
| `discover_content` | Discover movies/TV shows filtered by genre, rating, runtime, year, and sort order |
| `get_recommendations` | Get TMDB recommendations for a given movie or TV show |
| `get_trending_content` | Trending movies, TV shows, or both — daily or weekly window |
| `search_content` | Popular or top-rated movies/TV shows (category-based list) |
| `search` | Multi-search across movies and TV shows by free-text query |
| `search_by_title` | Search movies or TV shows by title |
| `search_by_person` | Search actors, directors, and other people by name |
| `get_content_details` | Full details (metadata, credits, watch providers) for a movie or TV show |

## Project Structure

```
src/
├── index.ts                    # Entry point — registers all 9 tools
└── lib/
    ├── make-service-request.ts # MCP envelope adapter + toolsMap
    ├── shared/
    │   ├── http.ts             # tmdbFetch (typed fetch + Zod parse) and buildQuery
    │   ├── media.ts            # Shared Zod schemas and normalization helpers
    │   └── types.ts            # Shared TypeScript union types
    ├── genres/
    ├── discover/
    ├── recommendations/
    ├── trending/
    ├── popular/
    ├── search/
    └── details/
```

Each feature folder contains:
- `service.ts` — async function(s) that call TMDB and return normalized data
- `service.types.ts` — Zod schemas for raw TMDB responses and TypeScript types for normalized output

## Adding a New Tool

1. Create `src/lib/<feature>/service.ts` and `service.types.ts` following existing patterns.
2. Add the tool name to `toolsMap` in `src/lib/make-service-request.ts`.
3. Register the tool in `src/index.ts` using `makeServiceRequest`.
