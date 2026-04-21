import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getGenres } from "./lib/genres/service.js";
import { GenresResponseSchema } from "./lib/genres/service.types.js";
import { discoverContent } from "./lib/discover/service.js";
import { getRecommendations } from "./lib/recommendations/service.js";
import { getTrendingContent } from "./lib/trending/service.js";
import { searchContent } from "./lib/popular/service.js";
import { search, searchByPerson, searchByTitle } from "./lib/search/service.js";
import { PaginatedPersonsResponseSchema } from "./lib/search/service.types.js";
import { getContentDetails } from "./lib/details/service.js";
import { ContentDetailsSchema } from "./lib/details/service.types.js";
import { PaginatedMediaResponseSchema } from "./lib/shared/media.js";
import { makeServiceRequest, toolsMap } from "./lib/make-service-request.js";

const server = new McpServer({
  name: "tmdb-agent",
  version: "1.0.0",
});

// ──────────────────────────────────────────────────────────────
// 1. Catálogo de géneros
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.get_genres,
  {
    description: "Retrieve the list of TMDB genres for movies or TV shows",
    inputSchema: z.object({
      contentType: z.enum(["movie", "tv"]).optional().default("movie"),
      lang: z.string().optional().default("en"),
    }),
    outputSchema: GenresResponseSchema.shape,
  },
  async ({ contentType, lang }) =>
    makeServiceRequest(getGenres, { contentType, language: lang }),
);

// ──────────────────────────────────────────────────────────────
// 2. Discover — motor de recomendación
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.discover_content,
  {
    description:
      "Discover movies or TV shows filtered by genre, rating, runtime, year and sort order",
    inputSchema: z.object({
      content_type: z.enum(["movie", "tv"]),
      with_genres: z.array(z.number()).optional(),
      vote_average_gte: z.number().optional(),
      sort_by: z
        .enum([
          "popularity.desc",
          "popularity.asc",
          "release_date.desc",
          "release_date.asc",
          "vote_average.desc",
          "vote_average.asc",
        ])
        .optional(),
      include_adult: z.boolean().optional(),
      primary_release_year: z.number().int().optional(),
      first_air_date_year: z.number().int().optional(),
      with_runtime_gte: z.number().int().optional(),
      with_runtime_lte: z.number().int().optional(),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async (args) => makeServiceRequest(discoverContent, args),
);

// ──────────────────────────────────────────────────────────────
// 3. Similares & recomendaciones
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.get_recommendations,
  {
    description:
      "Get content recommendations for a given movie or TV show from TMDB",
    inputSchema: z.object({
      content_type: z.enum(["movie", "tv"]),
      resource_id: z.number(),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async ({ content_type, resource_id, language, page }) =>
    makeServiceRequest(getRecommendations, {
      contentType: content_type,
      resourceId: resource_id,
      language,
      page,
    }),
);

// ──────────────────────────────────────────────────────────────
// 4. Tendencias & popularidad
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.get_trending_content,
  {
    description:
      "Get trending movies, TV shows or both, over a daily or weekly window",
    inputSchema: z.object({
      content_type: z.enum(["movie", "tv", "all"]).optional().default("all"),
      window: z.enum(["day", "week"]).optional().default("day"),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async (args) => makeServiceRequest(getTrendingContent, args),
);

server.registerTool(
  toolsMap.search_content,
  {
    description:
      "Get popular or top-rated movies/TV shows (category-based fallback list)",
    inputSchema: z.object({
      content_type: z.enum(["movie", "tv"]),
      category: z.enum(["popular", "top_rated"]),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async (args) => makeServiceRequest(searchContent, args),
);

// ──────────────────────────────────────────────────────────────
// 5. Búsqueda
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.search,
  {
    description:
      "Multi-search across movies and TV shows by free-text query (/search/multi)",
    inputSchema: z.object({
      query: z.string(),
      include_adult: z.boolean().optional(),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async (args) => makeServiceRequest(search, args),
);

server.registerTool(
  toolsMap.search_by_title,
  {
    description: "Search movies or TV shows by title",
    inputSchema: z.object({
      title: z.string(),
      content_type: z.enum(["movie", "tv"]),
      include_adult: z.boolean().optional(),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedMediaResponseSchema.shape,
  },
  async (args) => makeServiceRequest(searchByTitle, args),
);

server.registerTool(
  toolsMap.search_by_person,
  {
    description: "Search actors, directors and other people by name",
    inputSchema: z.object({
      name: z.string(),
      include_adult: z.boolean().optional(),
      language: z.string().optional().default("en"),
      page: z.number().int().positive().optional().default(1),
    }),
    outputSchema: PaginatedPersonsResponseSchema.shape,
  },
  async (args) => makeServiceRequest(searchByPerson, args),
);

// ──────────────────────────────────────────────────────────────
// 6. Detalles enriquecidos
// ──────────────────────────────────────────────────────────────
server.registerTool(
  toolsMap.get_content_details,
  {
    description:
      "Fetch full details (metadata, credits and watch providers) for a movie or TV show",
    inputSchema: z.object({
      content_type: z.enum(["movie", "tv"]),
      resource_id: z.number(),
      language: z.string().optional().default("en"),
    }),
    outputSchema: ContentDetailsSchema.shape,
  },
  async (args) => makeServiceRequest(getContentDetails, args),
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info("Server is running on stdin/stdout");
}

await runServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
