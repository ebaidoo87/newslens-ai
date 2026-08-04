export interface Article {
  id: number;

  title: string;

  summary: string | null;

  content: string | null;

  url: string;

  image_url: string | null;

  source: string;

  author: string | null;

  language: string;

  country: string;

  category: string;

  published_at: string | null;

  created_at: string;

  updated_at: string;
}