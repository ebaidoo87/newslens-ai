export interface Article {
  id: number;

  title: string;

  summary: string | null;

  url: string;

  source: string;

  author: string | null;

  language: string;

  country: string;

  category: string;

  published_at: string | null;
}