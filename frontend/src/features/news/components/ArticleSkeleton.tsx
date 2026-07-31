export default function ArticleSkeleton() {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-800
        bg-gray-900
        p-6
        animate-pulse
      "
    >

      {/* Title */}
      <div
        className="
          h-6
          w-3/4
          rounded
          bg-gray-700
        "
      />


      {/* Summary lines */}
      <div className="mt-4 space-y-3">

        <div
          className="
            h-4
            w-full
            rounded
            bg-gray-800
          "
        />

        <div
          className="
            h-4
            w-5/6
            rounded
            bg-gray-800
          "
        />

      </div>


      {/* Metadata */}
      <div
        className="
          mt-6
          flex
          gap-3
        "
      >

        <div
          className="
            h-4
            w-20
            rounded
            bg-gray-800
          "
        />

        <div
          className="
            h-4
            w-16
            rounded
            bg-gray-800
          "
        />

        <div
          className="
            h-4
            w-24
            rounded
            bg-gray-800
          "
        />

      </div>


    </div>
  );
}