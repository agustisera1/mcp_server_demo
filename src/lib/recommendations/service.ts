import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  normalizePaginatedMedia,
  tmdbMediaItemSchema,
  tmdbPaginatedSchema,
  type PaginatedMediaResponse,
} from "../shared/media.js";
import type { GetRecommendationsOptions } from "./service.types.js";

export async function getRecommendations(
  options: GetRecommendationsOptions,
): Promise<PaginatedMediaResponse> {
  const { contentType, resourceId, language = "en", page = 1 } = options;
  const data = await tmdbFetch(
    `/${contentType}/${resourceId}/recommendations${buildQuery({
      language,
      page,
    })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    "Failed to fetch recommendations",
  );
  return normalizePaginatedMedia(data, contentType);
}
