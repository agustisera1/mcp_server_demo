import type { TrendingScope, TrendingWindow } from "../shared/types.js";

export type GetTrendingContentOptions = {
  content_type?: TrendingScope;
  window?: TrendingWindow;
  language?: string;
  page?: number;
};
