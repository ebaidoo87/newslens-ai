import { useArticles } from "../hooks/useArticles";

import ArticleList from "../components/ArticleList";


export default function NewsPage() {

  const {
    data,
    isLoading,
    isError,
  } = useArticles();


  if (isLoading) {

    return (
      <h2>
        Loading articles...
      </h2>
    );

  }


  if (isError) {

    return (
      <h2>
        Failed to load articles.
      </h2>
    );

  }


  return (

    <div className="space-y-8">


      <div>

        <h1 className="
          text-4xl
          font-bold
        ">
          Latest News
        </h1>


        <p className="
          mt-2
          text-gray-400
        ">
          AI-powered news intelligence
        </p>

      </div>


      <ArticleList
        articles={data ?? []}
      />


    </div>

  );
}