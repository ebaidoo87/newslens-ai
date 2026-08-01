import { useQuery } from "@tanstack/react-query";

import { getArticles } from "../../../shared/services/articleApi";

export function useArticles(
  search?: string
) {

  return useQuery({

    queryKey:[
      "articles",
      search
    ],

    queryFn: () =>
      getArticles(search),

  });

}