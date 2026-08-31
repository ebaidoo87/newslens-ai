export const queryKeys = {
  recommendations: {
    all: ["recommendations"] as const,

    list: (
      limit: number,
    ) => [
      ...queryKeys.recommendations.all,
      limit,
    ] as const,
  },

  discovery: {
    all: ["discovery"] as const,

    list: (
      limit: number,
    ) => [
      ...queryKeys.discovery.all,
      limit,
    ] as const,
  },

  trending: {
    all: ["trending"] as const,

    list: (
      country: string | undefined,
      limit: number,
    ) => [
      ...queryKeys.trending.all,
      country ?? "world",
      limit,
    ] as const,
  },
} as const;