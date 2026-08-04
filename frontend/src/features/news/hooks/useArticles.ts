import { useQuery } from "@tanstack/react-query";

import { getArticles } from "../../../shared/services/articleApi";

export function useArticles(
  search?: string,
  category?: string,
) {
  return useQuery({
    queryKey: [
      "articles",
      search,
      category,
    ],

    queryFn: () =>
      getArticles(
        search,
        category,
      ),
  });
}