import {
  Bookmark,
  Eye,
} from "lucide-react";


interface FeedStatusBadgeProps {
  isBookmarked: boolean;
  isViewed: boolean;
}


export default function FeedStatusBadge({
  isBookmarked,
  isViewed,
}: FeedStatusBadgeProps) {
  if (
    !isBookmarked
    && !isViewed
  ) {
    return null;
  }


  return (
    <div
      className="
        flex
        flex-wrap
        gap-2
      "
      aria-label="Article activity"
    >
      {isBookmarked && (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-blue-800
            bg-blue-950/40
            px-3
            py-1
            text-xs
            font-medium
            text-blue-300
          "
        >
          <Bookmark
            size={13}
            aria-hidden="true"
          />

          Saved
        </span>
      )}


      {isViewed && (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-gray-700
            bg-gray-900
            px-3
            py-1
            text-xs
            font-medium
            text-gray-400
          "
        >
          <Eye
            size={13}
            aria-hidden="true"
          />

          Viewed
        </span>
      )}
    </div>
  );
}