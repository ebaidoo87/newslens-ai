import { api } from "./api";

import type { Article } from "../../features/news/types/article";

export async function getArticles(
  search?: string
): Promise<Article[]> {

  console.log("Searching API for:", search);

  const response =
    await api.get<Article[]>("/articles", {

      params: {
        search,
      },

    });


  return response.data;
}