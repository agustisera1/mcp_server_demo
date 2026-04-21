import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  normalizePaginatedMedia,
  tmdbMediaItemSchema,
  tmdbPaginatedSchema,
  type PaginatedMediaResponse,
} from "../shared/media.js";
import type { SearchContentOptions } from "./service.types.js";

export async function searchContent(
  options: SearchContentOptions,
): Promise<PaginatedMediaResponse> {
  const { content_type, category, language = "en", page = 1 } = options;
  const data = await tmdbFetch(
    `/${content_type}/${category}${buildQuery({ language, page })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    `Failed to fetch ${category} ${content_type}`,
  );
  return normalizePaginatedMedia(data, content_type);
}
