import ArticleSkeleton from "./ArticleSkeleton";


export default function ArticleSkeletonList() {

  return (

    <div
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >

      {Array.from({ length: 6 }).map((_, index) => (

        <ArticleSkeleton
          key={index}
        />

      ))}

    </div>

  );
}