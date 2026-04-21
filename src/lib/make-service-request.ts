export const toolsMap = {
  get_genres: "get_genres",
  discover_content: "discover_content",
  get_recommendations: "get_recommendations",
  get_trending_content: "get_trending_content",
  search_content: "search_content",
  search: "search",
  search_by_title: "search_by_title",
  search_by_person: "search_by_person",
  get_content_details: "get_content_details",
} as const;

export type ToolKey = keyof typeof toolsMap;

export async function makeServiceRequest<
  A extends unknown[],
  R extends Record<string, unknown>,
>(
  service: (...args: A) => Promise<R>,
  ...args: A
): Promise<{ content: []; structuredContent: R }> {
  try {
    const result = await service(...args);
    return { content: [], structuredContent: result };
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to make ${service.name} tool request: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
