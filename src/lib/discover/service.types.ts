import type { ContentType, SortBy } from "../shared/types.js";

export type DiscoverContentOptions = {
  content_type: ContentType;
  with_genres?: number[];
  vote_average_gte?: number;
  sort_by?: SortBy;
  include_adult?: boolean;
  primary_release_year?: number;
  first_air_date_year?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  language?: string;
  page?: number;
};
