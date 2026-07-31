import type { Article } from "../types/article";


interface ArticleCardProps {
  article: Article;
}


export default function ArticleCard({
  article,
}: ArticleCardProps) {

  return (
    <article
      className="
        rounded-xl
        border
        border-gray-800
        bg-gray-900
        p-6
        transition
        hover:border-gray-600
      "
    >

      <h2 className="text-xl font-semibold">
        {article.title}
      </h2>


      <p className="
        mt-3
        text-gray-400
        leading-relaxed
      ">
        {article.summary}
      </p>


      <div className="
        mt-5
        flex
        flex-wrap
        gap-3
        text-sm
        text-gray-500
      ">

        <span>
          📰 {article.source}
        </span>


        <span>
          🌍 {article.country}
        </span>


        <span>
          🏷 {article.category}
        </span>

      </div>


      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-5
          inline-block
          text-blue-400
          hover:text-blue-300
        "
      >
        Read article →
      </a>

    </article>
  );
}