import type { ContentType } from "../shared/types.js";

export type GetRecommendationsOptions = {
  contentType: ContentType;
  resourceId: number;
  language?: string;
  page?: number;
};
