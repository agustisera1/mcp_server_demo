import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  normalizePaginatedMedia,
  tmdbMediaItemSchema,
  tmdbPaginatedSchema,
  type PaginatedMediaResponse,
} from "../shared/media.js";
import type { DiscoverContentOptions } from "./service.types.js";

export async function discoverContent(
  options: DiscoverContentOptions,
): Promise<PaginatedMediaResponse> {
  const {
    content_type,
    with_genres,
    vote_average_gte,
    sort_by,
    include_adult,
    primary_release_year,
    first_air_date_year,
    with_runtime_gte,
    with_runtime_lte,
    language = "en",
    page = 1,
  } = options;
  const data = await tmdbFetch(
    `/discover/${content_type}${buildQuery({
      with_genres: with_genres?.join(","),
      "vote_average.gte": vote_average_gte,
      sort_by,
      include_adult,
      primary_release_year,
      first_air_date_year,
      "with_runtime.gte": with_runtime_gte,
      "with_runtime.lte": with_runtime_lte,
      language,
      page,
    })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    "Failed to discover content",
  );
  return normalizePaginatedMedia(data, content_type);
}
