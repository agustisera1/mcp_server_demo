export type ContentType = "movie" | "tv";
export type TrendingScope = ContentType | "all";
export type TrendingWindow = "day" | "week";
export type SortBy =
  | "popularity.desc"
  | "popularity.asc"
  | "release_date.desc"
  | "release_date.asc"
  | "vote_average.desc"
  | "vote_average.asc";
export type PopularCategory = "popular" | "top_rated";
