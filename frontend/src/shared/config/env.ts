function requireEnv(
  value: string | undefined,
  name: string,
): string {
  const normalized =
    value?.trim();

  if (!normalized) {
    throw new Error(
      `${name} is not configured.`,
    );
  }

  return normalized;
}


function normalizeBaseUrl(
  value: string,
): string {
  return value.replace(
    /\/+$/,
    "",
  );
}


export const env = {
  apiBaseUrl:
    normalizeBaseUrl(
      requireEnv(
        import.meta.env.VITE_API_BASE_URL,
        "VITE_API_BASE_URL",
      ),
    ),

  appName:
    import.meta.env.VITE_APP_NAME
      ?.trim()
      || "NewsLens AI",

  appVersion:
    import.meta.env.VITE_APP_VERSION
      ?.trim()
      || "development",

  isDevelopment:
    import.meta.env.DEV,

  isProduction:
    import.meta.env.PROD,
} as const;