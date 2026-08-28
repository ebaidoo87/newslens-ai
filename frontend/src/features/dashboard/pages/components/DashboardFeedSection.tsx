import type {
  ReactNode,
} from "react";

import {
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


interface DashboardFeedSectionProps {
  title: string;
  description?: string;

  viewAllTo?: string;
  viewAllLabel?: string;

  isLoading?: boolean;
  error?: string | null;

  isEmpty?: boolean;

  emptyTitle?: string;
  emptyMessage?: string;

  children: ReactNode;
}


function FeedSkeleton() {
  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        xl:grid-cols-3
      "
      aria-hidden="true"
    >
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            min-h-64
            animate-pulse
            rounded-2xl
            border
            border-gray-800
            bg-gray-900/60
            p-5
          "
        >
          <div
            className="
              h-4
              w-24
              rounded
              bg-gray-800
            "
          />

          <div
            className="
              mt-5
              h-6
              w-11/12
              rounded
              bg-gray-800
            "
          />

          <div
            className="
              mt-3
              h-6
              w-8/12
              rounded
              bg-gray-800
            "
          />

          <div
            className="
              mt-6
              space-y-2
            "
          >
            <div
              className="
                h-3
                w-full
                rounded
                bg-gray-800
              "
            />

            <div
              className="
                h-3
                w-10/12
                rounded
                bg-gray-800
              "
            />

            <div
              className="
                h-3
                w-7/12
                rounded
                bg-gray-800
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}


export default function DashboardFeedSection({
  title,
  description,

  viewAllTo,
  viewAllLabel = "View all",

  isLoading = false,
  error = null,

  isEmpty = false,

  emptyTitle = "Nothing to show yet.",
  emptyMessage =
    "New stories will appear here when they become available.",

  children,
}: DashboardFeedSectionProps) {
  return (
    <section
      className="
        space-y-5
        sm:space-y-6
      "
      aria-labelledby={
        `${title
          .toLowerCase()
          .replace(/\s+/g, "-")}-heading`
      }
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h2
            id={
              `${title
                .toLowerCase()
                .replace(/\s+/g, "-")}-heading`
            }
            className="
              text-xl
              font-semibold
              tracking-tight
              text-white
              sm:text-2xl
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1.5
                max-w-2xl
                text-sm
                leading-6
                text-gray-400
              "
            >
              {description}
            </p>
          )}
        </div>


        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              text-sm
              font-medium
              text-blue-400
              transition
              hover:text-blue-300
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              focus-visible:ring-offset-2
              focus-visible:ring-offset-gray-950
              sm:self-center
            "
          >
            {viewAllLabel}

            <ArrowRight
              size={15}
              aria-hidden="true"
            />
          </Link>
        )}
      </div>


      {isLoading ? (
        <>
          <span className="sr-only">
            Loading {title}
          </span>

          <FeedSkeleton />
        </>
      ) : error ? (
        <div
          role="alert"
          className="
            flex
            gap-3
            rounded-xl
            border
            border-red-900/70
            bg-red-950/20
            p-5
          "
        >
          <AlertCircle
            size={20}
            className="
              mt-0.5
              shrink-0
              text-red-400
            "
            aria-hidden="true"
          />

          <div>
            <p
              className="
                font-medium
                text-red-300
              "
            >
              Unable to load this section.
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-gray-400
              "
            >
              {error}
            </p>
          </div>
        </div>
      ) : isEmpty ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-gray-800
            bg-gray-900/30
            px-5
            py-10
            text-center
            sm:px-8
          "
        >
          <p
            className="
              font-medium
              text-gray-200
            "
          >
            {emptyTitle}
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-gray-500
            "
          >
            {emptyMessage}
          </p>
        </div>
      ) : (
        children
      )}
    </section>
  );
}