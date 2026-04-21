import { z } from "zod";
import { tmdbGenreSchema } from "../shared/media.js";
import type { ContentType } from "../shared/types.js";

export type GetContentDetailsOptions = {
  content_type: ContentType;
  resource_id: number;
  language?: string;
};

// ── TMDB wire schemas ─────────────────────────────────────────

export const tmdbMovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  runtime: z.number().nullable().optional(),
  vote_average: z.number().optional().default(0),
  tagline: z.string().optional(),
  genres: z.array(tmdbGenreSchema).optional(),
});

export const tmdbTvDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  first_air_date: z.string().optional(),
  episode_run_time: z.array(z.number()).optional(),
  vote_average: z.number().optional().default(0),
  tagline: z.string().optional(),
  genres: z.array(tmdbGenreSchema).optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
});

export const tmdbCastSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().optional(),
  profile_path: z.string().nullable().optional(),
  order: z.number().optional(),
});
export const tmdbCrewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string().optional(),
  department: z.string().optional(),
  profile_path: z.string().nullable().optional(),
});
export const tmdbCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(tmdbCastSchema),
  crew: z.array(tmdbCrewSchema),
});

export const tmdbProviderEntrySchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable().optional(),
});
export const tmdbProviderCountrySchema = z.object({
  link: z.string().optional(),
  flatrate: z.array(tmdbProviderEntrySchema).optional(),
  rent: z.array(tmdbProviderEntrySchema).optional(),
  buy: z.array(tmdbProviderEntrySchema).optional(),
});
export const tmdbProvidersResponseSchema = z.object({
  id: z.number(),
  results: z.record(tmdbProviderCountrySchema),
});

// ── Domain schemas ────────────────────────────────────────────

export const ContentMetaSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  tagline: z.string().optional(),
  release_date: z.string().optional(),
  runtime_minutes: z.number().optional(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  content_type: z.enum(["movie", "tv"]),
});

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().optional(),
  profile_path: z.string().nullable(),
});
export const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string().optional(),
  department: z.string().optional(),
  profile_path: z.string().nullable(),
});
export const CreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

export const ProviderSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable(),
});
export const ProvidersByRegionSchema = z.object({
  region: z.string(),
  link: z.string().optional(),
  flatrate: z.array(ProviderSchema),
  rent: z.array(ProviderSchema),
  buy: z.array(ProviderSchema),
});

export const ContentDetailsSchema = z.object({
  meta: ContentMetaSchema,
  credits: CreditsSchema,
  providers: z.array(ProvidersByRegionSchema),
});

export type ContentMeta = z.infer<typeof ContentMetaSchema>;
export type Credits = z.infer<typeof CreditsSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type ProvidersByRegion = z.infer<typeof ProvidersByRegionSchema>;
export type ContentDetails = z.infer<typeof ContentDetailsSchema>;
