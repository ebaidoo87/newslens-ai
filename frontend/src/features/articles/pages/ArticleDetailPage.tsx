

import {

  useEffect,

  useState,

} from "react";



import {

  Link,

  useParams,

} from "react-router-dom";



import {

  ArrowLeft,

  CalendarDays,

  ExternalLink,

  User,

} from "lucide-react";



import BookmarkButton from "../../bookmarks/components/BookmarkButton";



import {

  useAuth,

} from "../../../shared/context/AuthContext";



import {

  getArticleById,

} from "../../../shared/services/articleApi";



import {

  recordArticleView,

} from "../../../shared/services/readingHistoryApi";



import ArticleImage from "../../../shared/components/ArticleImage/ArticleImage";



import {

  getCountryMetadata,

} from "../../../shared/utils/countries";



import {

  getReadingTime,

  getRelativeTime,

} from "../../../shared/utils/articleMeta";



import type {

  Article,

} from "../../news/types/article";

import {
  useReadingHistory,
} from "../../../shared/context/ReadingHistoryContext";





export default function ArticleDetailPage() {

  const {

    id,

  } = useParams<{

    id: string;

  }>();



  const {

    isAuthenticated,

  } = useAuth();



  const [

    article,

    setArticle,

  ] = useState<Article | null>(null);



  const [

    isLoading,

    setIsLoading,

  ] = useState(true);



  const [

    error,

    setError,

  ] = useState("");

  const {
  refreshHistory,
} = useReadingHistory();





  useEffect(() => {

    async function loadArticle() {

      if (!id) {

        setError(

          "No article ID was provided.",

        );



        setIsLoading(false);

        return;

      }



      const articleId =

        Number(id);



      if (

        Number.isNaN(articleId)

        || articleId <= 0

      ) {

        setError(

          "The article ID is invalid.",

        );



        setIsLoading(false);

        return;

      }



      try {

        const data =

          await getArticleById(

            articleId,

          );



        setArticle(data);

      } catch {

        setError(

          "Unable to load this article.",

        );

      } finally {

        setIsLoading(false);

      }

    }



    loadArticle();

  }, [id]);





  useEffect(() => {
  if (
    !isAuthenticated
    || !article?.id
  ) {
    return;
  }

  async function recordView() {
    try {
      await recordArticleView(
        article!.id,
      );

      await refreshHistory();
    } catch {
      // History tracking should not
      // interrupt article viewing.
    }
  }

  recordView();
}, [
  article?.id,
  isAuthenticated,
]);





  if (isLoading) {

    return (

      <div className="mx-auto max-w-4xl py-20 text-center text-gray-400">

        Loading article...

      </div>

    );

  }





  if (error) {

    return (

      <div className="mx-auto max-w-4xl py-20">

        <div className="rounded-2xl border border-red-900 bg-red-950/40 p-8 text-center">

          <h1 className="text-2xl font-bold text-red-300">

            Unable to display article

          </h1>



          <p className="mt-3 text-red-200">

            {error}

          </p>



          <Link

            to="/news"

            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"

          >

            <ArrowLeft size={18} />



            Back to news

          </Link>

        </div>

      </div>

    );

  }





  if (!article) {

    return (

      <div className="mx-auto max-w-4xl py-20 text-center">

        <h1 className="text-3xl font-bold">

          Article not found

        </h1>



        <Link

          to="/news"

          className="mt-6 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"

        >

          <ArrowLeft size={18} />



          Back to news

        </Link>

      </div>

    );

  }





  const country =

    getCountryMetadata(

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

    <article className="mx-auto max-w-4xl space-y-8">



      <Link

        to="/news"

        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"

      >

        <ArrowLeft size={18} />



        Back to news

      </Link>





      <header className="space-y-6">

        <div className="flex flex-wrap gap-3">

          <span className="rounded-full bg-blue-950 px-3 py-1 text-sm font-medium capitalize text-blue-300">

            {article.category}

          </span>



          <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">

            {country.flag} {country.name}

          </span>



          <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">

            {readingTime}

          </span>

        </div>





        <h1 className="text-4xl font-bold leading-tight md:text-5xl">

          {article.title}

        </h1>





        {article.summary && (

          <p className="text-xl leading-relaxed text-gray-400">

            {article.summary}

          </p>

        )}





        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">

          <span>

            {article.source}

          </span>



          {article.author && (

            <span className="inline-flex items-center gap-2">

              <User size={16} />



              {article.author}

            </span>

          )}



          <span className="inline-flex items-center gap-2">

            <CalendarDays size={16} />



            {relativeTime}

          </span>

        </div>





        <div className="flex flex-wrap items-center gap-4">

          <BookmarkButton

            article={article}

          />



          <a

            href={article.url}

            target="_blank"

            rel="noopener noreferrer"

            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-500"

          >

            Visit original source



            <ExternalLink size={17} />

          </a>

        </div>

      </header>





      <div className="overflow-hidden rounded-2xl border border-gray-800">

        <ArticleImage

          src={article.image_url}

          alt={article.title}

        />

      </div>





      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 md:p-8">

        <h2 className="text-2xl font-bold">

          Article

        </h2>



        {article.content ? (

          <div className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-300">

            {article.content}

          </div>

        ) : article.summary ? (

          <div className="mt-6 text-lg leading-8 text-gray-300">

            {article.summary}

          </div>

        ) : (

          <p className="mt-6 text-gray-400">

            The full article content is not

            available inside NewsLens.

          </p>

        )}





        <a

          href={article.url}

          target="_blank"

          rel="noopener noreferrer"

          className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"

        >

          Continue reading on {article.source}



          <ExternalLink size={17} />

        </a>

      </section>



    </article>

  );

}
