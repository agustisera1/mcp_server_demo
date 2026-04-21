import { z } from "zod";
import type { ContentType } from "../shared/types.js";

export type SearchOptions = {
  query: string;
  include_adult?: boolean;
  language?: string;
  page?: number;
};

export type SearchByTitleOptions = {
  title: string;
  content_type: ContentType;
  include_adult?: boolean;
  language?: string;
  page?: number;
};

export type SearchByPersonOptions = {
  name: string;
  include_adult?: boolean;
  language?: string;
  page?: number;
};

export const tmdbPersonItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  known_for_department: z.string().optional(),
  profile_path: z.string().nullable().optional(),
  popularity: z.number().optional(),
});

export const PersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  known_for_department: z.string().optional(),
  profile_path: z.string().nullable(),
  popularity: z.number().optional(),
});
export const PaginatedPersonsResponseSchema = z.object({
  page: z.number(),
  results: z.array(PersonSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type Person = z.infer<typeof PersonSchema>;
export type PaginatedPersonsResponse = z.infer<
  typeof PaginatedPersonsResponseSchema
>;
