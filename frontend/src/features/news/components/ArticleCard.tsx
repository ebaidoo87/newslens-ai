import { Link } from "react-router-dom";

import {
  getCountryMetadata,
} from "../../../shared/utils/countries";

import type { Article } from "../types/article";

import BookmarkButton from "../../bookmarks/components/BookmarkButton";

import ArticleImage from "../../../shared/components/ArticleImage/ArticleImage";

import {
  getReadingTime,
  getRelativeTime,
} from "../../../shared/utils/articleMeta";


interface ArticleCardProps {
  article: Article;
}


export default function ArticleCard({
  article,
}: ArticleCardProps) {
  const country = getCountryMetadata(
    article.country,
  );

  const relativeTime =
  getRelativeTime(
    article.published_at,
  );

const readingTime =
  getReadingTime(
    article.content,
    article.summary,
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">

      {article.image_url && (
        <ArticleImage
            src={article.image_url}
            alt={article.title}
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-medium capitalize text-blue-300">
            {article.category}
          </span>

          <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
            {country.flag} {country.name}
          </span>
          
          <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-medium capitalize text-blue-300">
            {readingTime}
          </span>
        </div>

        <Link
          to={`/articles/${article.id}`}
          className="group"
        >
          <h2 className="text-xl font-semibold transition group-hover:text-blue-300">
            {article.title}
          </h2>

          {article.summary && (
            <p className="mt-3 line-clamp-3 leading-relaxed text-gray-400">
              {article.summary}
            </p>
          )}
        </Link>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              {article.source}
            </span>

            {article.published_at && (
              <span>
                {new Date(
                  article.published_at,
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
                to={`/articles/${article.id}`}
                className="font-medium text-blue-400 hover:text-blue-300"
            >
                View details...
            </Link>

            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white-400 hover:text-white-300"
            >
                Visit source ↗
            </a>

            <BookmarkButton
                article={article}
            />

         </div>
         
        </div>
        <div className="mt-4 pt-1">
          <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-medium capitalize text-blue-300">
            {relativeTime}
          </span>
          </div>
      </div>
      
    

    </article>
  );
}