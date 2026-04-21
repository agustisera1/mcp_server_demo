import type { ContentType, PopularCategory } from "../shared/types.js";

export type SearchContentOptions = {
  content_type: ContentType;
  category: PopularCategory;
  language?: string;
  page?: number;
};
