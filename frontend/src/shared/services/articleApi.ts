import { api } from "./api";

import type { Article } from "../../features/news/types/article";

export async function getArticles(): Promise<Article[]> {
  const response = await api.get<Article[]>("/articles");

  return response.data;
}