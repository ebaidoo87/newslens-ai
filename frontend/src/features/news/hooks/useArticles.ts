import { useQuery } from "@tanstack/react-query";

import { getArticles } from "../../../shared/services/articleApi";

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],

    queryFn: getArticles,
  });
}