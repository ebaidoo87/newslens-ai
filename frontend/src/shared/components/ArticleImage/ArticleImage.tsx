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
}


export default function ArticleImage({
  src,
  alt,
  articleId,
}: ArticleImageProps) {
  const [hasError, setHasError] =
    useState(false);

  const image = !src || hasError ? (
    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="text-center">
        <div className="text-4xl">
          📰
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Image unavailable
        </p>
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() =>
        setHasError(true)
      }
      className="
        h-48
        w-full
        object-cover
        transition-transform
        duration-300
        ease-out
        group-hover:scale-105
      "
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
      to={`/articles/${articleId}`}
      className="
        group
        block
        overflow-hidden
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
      "
      aria-label={`View ${alt}`}
    >
      {image}
    </Link>
  );
}