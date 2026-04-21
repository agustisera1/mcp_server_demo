import { z } from "zod";
import { tmdbGenreSchema } from "../shared/media.js";
import type { ContentType } from "../shared/types.js";

export type GetGenresOptions = {
  contentType?: ContentType;
  language?: string;
};

export const tmdbGenresResponseSchema = z.object({
  genres: z.array(tmdbGenreSchema),
});

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  lang: z.string(),
});
export const GenresResponseSchema = z.object({
  genres: z.array(GenreSchema),
});

export type Genre = z.infer<typeof GenreSchema>;
export type GenresResponse = z.infer<typeof GenresResponseSchema>;
