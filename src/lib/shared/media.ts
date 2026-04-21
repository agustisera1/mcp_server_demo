import { z } from "zod";
import type { ContentType } from "./types.js";

export const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const tmdbMediaItemSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  overview: z.string().optional().default(""),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  vote_average: z.number().optional().default(0),
  vote_count: z.number().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  original_language: z.string().optional(),
  popularity: z.number().optional(),
  media_type: z.enum(["movie", "tv", "person"]).optional(),
});
export type TmdbMediaItem = z.infer<typeof tmdbMediaItemSchema>;

export const tmdbPaginatedSchema = <S extends z.ZodTypeAny>(item: S) =>
  z.object({
    page: z.number(),
    results: z.array(item),
    total_pages: z.number(),
    total_results: z.number(),
  });

export const MediaItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string().optional(),
  content_type: z.enum(["movie", "tv"]),
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

export const PaginatedMediaResponseSchema = z.object({
  page: z.number(),
  results: z.array(MediaItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
});
export type PaginatedMediaResponse = z.infer<
  typeof PaginatedMediaResponseSchema
>;

type TmdbPaginatedMedia = {
  page: number;
  results: TmdbMediaItem[];
  total_pages: number;
  total_results: number;
};

export function normalizeMediaItem(
  item: TmdbMediaItem,
  fallback: ContentType,
): MediaItem {
  const content_type: ContentType =
    item.media_type === "tv"
      ? "tv"
      : item.media_type === "movie"
        ? "movie"
        : fallback;
  return {
    id: item.id,
    title: item.title ?? item.name ?? "",
    overview: item.overview ?? "",
    poster_path: item.poster_path ?? null,
    vote_average: item.vote_average ?? 0,
    release_date: item.release_date ?? item.first_air_date,
    content_type,
  };
}

export function normalizePaginatedMedia(
  data: TmdbPaginatedMedia,
  fallback: ContentType,
): PaginatedMediaResponse {
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map((item) => normalizeMediaItem(item, fallback)),
  };
}
