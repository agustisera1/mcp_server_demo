import { z } from "zod";
import { buildQuery, tmdbFetch } from "../shared/http.js";
import type { ContentType } from "../shared/types.js";
import {
  type ContentDetails,
  type ContentMeta,
  type Credits,
  type GetContentDetailsOptions,
  type Provider,
  type ProvidersByRegion,
  tmdbCreditsSchema,
  tmdbMovieDetailsSchema,
  tmdbProviderEntrySchema,
  tmdbProvidersResponseSchema,
  tmdbTvDetailsSchema,
} from "./service.types.js";

async function getResourceMeta(
  contentType: ContentType,
  resourceId: number,
  language: string,
): Promise<ContentMeta> {
  if (contentType === "movie") {
    const data = await tmdbFetch(
      `/movie/${resourceId}${buildQuery({ language })}`,
      tmdbMovieDetailsSchema,
      "Failed to fetch movie details",
    );
    return {
      id: data.id,
      title: data.title,
      overview: data.overview ?? "",
      poster_path: data.poster_path ?? null,
      vote_average: data.vote_average,
      tagline: data.tagline,
      release_date: data.release_date,
      runtime_minutes: data.runtime ?? undefined,
      genres: data.genres ?? [],
      content_type: "movie",
    };
  }
  const data = await tmdbFetch(
    `/tv/${resourceId}${buildQuery({ language })}`,
    tmdbTvDetailsSchema,
    "Failed to fetch tv details",
  );
  return {
    id: data.id,
    title: data.name,
    overview: data.overview ?? "",
    poster_path: data.poster_path ?? null,
    vote_average: data.vote_average,
    tagline: data.tagline,
    release_date: data.first_air_date,
    runtime_minutes: data.episode_run_time?.[0],
    genres: data.genres ?? [],
    content_type: "tv",
  };
}

async function getResourceCredits(
  contentType: ContentType,
  resourceId: number,
): Promise<Credits> {
  const data = await tmdbFetch(
    `/${contentType}/${resourceId}/credits`,
    tmdbCreditsSchema,
    "Failed to fetch credits",
  );
  return {
    cast: data.cast.map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profile_path: member.profile_path ?? null,
    })),
    crew: data.crew.map((member) => ({
      id: member.id,
      name: member.name,
      job: member.job,
      department: member.department,
      profile_path: member.profile_path ?? null,
    })),
  };
}

function mapProviders(
  list?: z.infer<typeof tmdbProviderEntrySchema>[],
): Provider[] {
  return (list ?? []).map((provider) => ({
    provider_id: provider.provider_id,
    provider_name: provider.provider_name,
    logo_path: provider.logo_path ?? null,
  }));
}

async function getResourceProviders(
  contentType: ContentType,
  resourceId: number,
): Promise<ProvidersByRegion[]> {
  const data = await tmdbFetch(
    `/${contentType}/${resourceId}/watch/providers`,
    tmdbProvidersResponseSchema,
    "Failed to fetch providers",
  );
  return Object.entries(data.results).map(([region, info]) => ({
    region,
    link: info.link,
    flatrate: mapProviders(info.flatrate),
    rent: mapProviders(info.rent),
    buy: mapProviders(info.buy),
  }));
}

export async function getContentDetails(
  options: GetContentDetailsOptions,
): Promise<ContentDetails> {
  const { content_type, resource_id, language = "en" } = options;
  const [meta, credits, providers] = await Promise.all([
    getResourceMeta(content_type, resource_id, language),
    getResourceCredits(content_type, resource_id),
    getResourceProviders(content_type, resource_id),
  ]);
  return { meta, credits, providers };
}
