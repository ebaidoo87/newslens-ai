import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getArticleById } from "../../../shared/services/articleApi";

import type { Article } from "../../news/types/article";

import {
  getCountryMetadata,
} from "../../../shared/utils/countries";


export default function ArticleDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;

      try {
        const data = await getArticleById(Number(id));

        setArticle(data);
      } catch (err) {
        console.error(err);

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading article...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/news")}
          className="text-blue-500 hover:underline"
        >
          ← Back to News
        </button>

        <div className="rounded-xl border border-red-700 bg-red-950 p-6">
          <h2 className="text-2xl font-bold text-red-300">
            Article not found
          </h2>

          <p className="mt-2 text-red-200">
            The requested article could not be loaded.
          </p>
        </div>

      </div>
    );
  }

  const country = getCountryMetadata(article.country);

  return (
    <article className="mx-auto max-w-4xl space-y-8">

      <button
        onClick={() => navigate("/news")}
        className="text-blue-500 hover:underline"
      >
        ← Back to News
      </button>

      <div>

        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
          {article.category}
        </span>

        <h1 className="mt-4 text-5xl font-bold">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-4 text-gray-400">

          <span>
            Author: {article.author ?? "Unknown"}
          </span>

          <span>
            Source: {article.source}
          </span>

          <span>
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString()
              : new Date(article.created_at).toLocaleDateString()}
          </span>

          <span>
            {country.flag} {country.name}
          </span>

        </div>

      </div>

      {article.summary && (
        <p className="text-xl text-gray-300">
          {article.summary}
        </p>
      )}

      <div className="prose prose-invert max-w-none">

        <p>
          {article.content ?? "No content available."}
        </p>

      </div>

      <div className="border-t border-gray-700 pt-6">

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read the original article →
        </a>

      </div>

    </article>
  );
}