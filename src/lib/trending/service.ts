import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  normalizePaginatedMedia,
  tmdbMediaItemSchema,
  tmdbPaginatedSchema,
  type PaginatedMediaResponse,
} from "../shared/media.js";
import type { ContentType } from "../shared/types.js";
import type { GetTrendingContentOptions } from "./service.types.js";

export async function getTrendingContent(
  options: GetTrendingContentOptions = {},
): Promise<PaginatedMediaResponse> {
  const {
    content_type = "all",
    window: trendingWindow = "day",
    language = "en",
    page = 1,
  } = options;
  const data = await tmdbFetch(
    `/trending/${content_type}/${trendingWindow}${buildQuery({
      language,
      page,
    })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    "Failed to fetch trending content",
  );
  const fallback: ContentType = content_type === "tv" ? "tv" : "movie";
  return normalizePaginatedMedia(data, fallback);
}
