import {
  useState,
} from "react";

interface ArticleImageProps {
  src: string | null | undefined;
  alt: string;
}

export default function ArticleImage({
  src,
  alt,
}: ArticleImageProps) {
  const [hasError, setHasError] =
    useState(false);

  if (!src || hasError) {
    return (
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
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() =>
        setHasError(true)
      }
      className="h-48 w-full object-cover"
    />
  );
}