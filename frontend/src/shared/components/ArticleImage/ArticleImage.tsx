import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";


interface ArticleImageProps {
  src: string | null | undefined;
  alt: string;
  articleId?: number;
  className?: string;
}


export default function ArticleImage({
  src,
  alt,
  articleId,
  className =
    "h-48 w-full",
}: ArticleImageProps) {
  const [hasError, setHasError] =
    useState(false);


  const shouldShowFallback =
    !src
    || hasError;


  const image =
    shouldShowFallback
      ? (
          <div
            className={`
              flex
              ${className}
              items-center
              justify-center
              bg-gradient-to-br
              from-gray-800
              to-gray-900
            `}
            role="img"
            aria-label={
              `${alt} image unavailable`
            }
          >
            <div className="text-center">
              <div
                className="text-4xl"
                aria-hidden="true"
              >
                📰
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Image unavailable
              </p>
            </div>
          </div>
        )
      : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() =>
              setHasError(true)
            }
            className={`
              ${className}
              object-cover
              transition-transform
              duration-300
              ease-out
              group-hover:scale-105
            `}
          />
        );


  if (!articleId) {
    return (
      <div className="overflow-hidden">
        {image}
      </div>
    );
  }


  return (
    <Link
      to={
        `/articles/${articleId}`
      }
      className="
        group
        block
        overflow-hidden
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
      "
      aria-label={
        `View ${alt}`
      }
    >
      {image}
    </Link>
  );
}