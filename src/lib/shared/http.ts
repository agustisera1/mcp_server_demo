import { z } from "zod";

const TMDB_BASE_URL =
  process.env.TMDB_API_URL ?? "https://api.themoviedb.org/3";

type QueryValue = string | number | boolean | undefined;

export function buildQuery(params: Record<string, QueryValue>): string {
  const base: Record<string, QueryValue> = {};
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) base.api_key = apiKey;

  const merged = { ...base, ...params };
  const pairs: [string, string][] = [];
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined) continue;
    pairs.push([key, String(value)]);
  }
  if (pairs.length === 0) return "";
  return `?${new URLSearchParams(pairs).toString()}`;
}

export async function tmdbFetch<S extends z.ZodTypeAny>(
  path: string,
  schema: S,
  context: string,
): Promise<z.infer<S>> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const headers: Record<string, string> = { accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${TMDB_BASE_URL}${path}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      throw new Error(`${context}: ${response.statusText}`);
    }
    return schema.parse(await response.json());
  } catch (error) {
    console.error(error);
    throw new Error(
      `${context}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
