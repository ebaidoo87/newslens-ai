interface PersonalizationOverviewProps {
  recommendationCount: number;
  discoveryCount: number;
  trendingCount: number;

  isAuthenticated: boolean;
  isLoading: boolean;
}


export default function PersonalizationOverview({
  recommendationCount,
  discoveryCount,
  trendingCount,
  isAuthenticated,
  isLoading,
}: PersonalizationOverviewProps) {
  if (isLoading) {
    return (
      <section
        className="
          rounded-2xl
          border
          border-gray-800
          bg-gray-900/60
          p-6
        "
      >
        <div
          className="
            h-6
            w-48
            animate-pulse
            rounded
            bg-gray-800
          "
        />

        <div
          className="
            mt-5
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          {[
            1,
            2,
            3,
          ].map(
            (item) => (
              <div
                key={item}
                className="
                  h-20
                  animate-pulse
                  rounded-xl
                  bg-gray-800
                "
              />
            ),
          )}
        </div>
      </section>
    );
  }


  return (
    <section
      className="
        rounded-2xl
        border
        border-gray-800
        bg-gray-900/60
        p-6
      "
    >
      <div>
        <h2
          className="
            text-xl
            font-semibold
            text-white
          "
        >
          Your NewsLens feed
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-400
          "
        >
          {isAuthenticated
            ? (
              "News selected using your "
              + "interests and activity."
            )
            : (
              "Sign in to unlock personalized "
              + "recommendations and discovery."
            )}
        </p>
      </div>


      <div
        className="
          mt-5
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        <FeedMetric
          label="Recommended"
          value={
            recommendationCount
          }
        />

        <FeedMetric
          label="Discover"
          value={
            discoveryCount
          }
        />

        <FeedMetric
          label="Trending"
          value={
            trendingCount
          }
        />
      </div>
    </section>
  );
}


interface FeedMetricProps {
  label: string;
  value: number;
}


function FeedMetric({
  label,
  value,
}: FeedMetricProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-800
        bg-gray-950/50
        p-4
      "
    >
      <p
        className="
          text-sm
          text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-2xl
          font-bold
          text-white
        "
      >
        {value}
      </p>
    </div>
  );
}