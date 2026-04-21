import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  normalizePaginatedMedia,
  tmdbMediaItemSchema,
  tmdbPaginatedSchema,
  type PaginatedMediaResponse,
} from "../shared/media.js";
import {
  type PaginatedPersonsResponse,
  type SearchByPersonOptions,
  type SearchByTitleOptions,
  type SearchOptions,
  tmdbPersonItemSchema,
} from "./service.types.js";

export async function search(
  options: SearchOptions,
): Promise<PaginatedMediaResponse> {
  const { query, include_adult, language = "en", page = 1 } = options;
  const data = await tmdbFetch(
    `/search/multi${buildQuery({ query, include_adult, language, page })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    "Failed to search",
  );
  const filtered = data.results.filter((item) => item.media_type !== "person");
  return normalizePaginatedMedia(
    {
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: filtered,
    },
    "movie",
  );
}

export async function searchByTitle(
  options: SearchByTitleOptions,
): Promise<PaginatedMediaResponse> {
  const {
    title,
    content_type,
    language = "en",
    page = 1,
    include_adult,
  } = options;
  const data = await tmdbFetch(
    `/search/${content_type}${buildQuery({
      query: title,
      language,
      page,
      include_adult,
    })}`,
    tmdbPaginatedSchema(tmdbMediaItemSchema),
    "Failed to search by title",
  );
  return normalizePaginatedMedia(data, content_type);
}

export async function searchByPerson(
  options: SearchByPersonOptions,
): Promise<PaginatedPersonsResponse> {
  const { name, language = "en", page = 1, include_adult } = options;
  const data = await tmdbFetch(
    `/search/person${buildQuery({
      query: name,
      language,
      page,
      include_adult,
    })}`,
    tmdbPaginatedSchema(tmdbPersonItemSchema),
    "Failed to search persons",
  );
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map((person) => ({
      id: person.id,
      name: person.name,
      known_for_department: person.known_for_department,
      profile_path: person.profile_path ?? null,
      popularity: person.popularity,
    })),
  };
}
