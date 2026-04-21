import { buildQuery, tmdbFetch } from "../shared/http.js";
import {
  type GetGenresOptions,
  type GenresResponse,
  tmdbGenresResponseSchema,
} from "./service.types.js";

export async function getGenres(
  options: GetGenresOptions = {},
): Promise<GenresResponse> {
  const { contentType = "movie", language = "en" } = options;
  const data = await tmdbFetch(
    `/genre/${contentType}/list${buildQuery({ language })}`,
    tmdbGenresResponseSchema,
    "Failed to fetch genres",
  );
  return {
    genres: data.genres.map((genre) => ({ ...genre, lang: language })),
  };
}
