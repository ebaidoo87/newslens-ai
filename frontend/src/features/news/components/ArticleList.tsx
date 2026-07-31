import type { Article } from "../types/article";

import ArticleCard from "./ArticleCard";


interface ArticleListProps {
  articles: Article[];
}


export default function ArticleList({
  articles,
}: ArticleListProps) {


  return (
    <div className="
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-3
    ">

      {articles.map((article) => (

        <ArticleCard
          key={article.id}
          article={article}
        />

      ))}

    </div>
  );
}