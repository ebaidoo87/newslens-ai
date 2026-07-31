import { api } from "./api";

import type { Article } from "../../features/news/types/article";

export async function getArticles(): Promise<Article[]> {

  await new Promise(
    resolve => setTimeout(resolve, 2000)
  );

  const response = await api.get<Article[]>("/articles");

  return response.data;
}