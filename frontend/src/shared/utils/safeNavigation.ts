const SAFE_EXTERNAL_PROTOCOLS =
  new Set([
    "http:",
    "https:",
  ]);


export function getSafeExternalUrl(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    typeof value !== "string"
    || !value.trim()
  ) {
    return null;
  }


  try {
    const url =
      new URL(
        value.trim(),
      );


    if (
      !SAFE_EXTERNAL_PROTOCOLS.has(
        url.protocol,
      )
    ) {
      return null;
    }


    return url.href;
  } catch {
    return null;
  }
}


export function getSafeInternalPath(
  value:
    | string
    | null
    | undefined,
  fallback = "/",
): string {
  if (
    typeof value !== "string"
    || !value.startsWith("/")
  ) {
    return fallback;
  }


  /*
   * Prevent protocol-relative redirects:
   *
   * //evil.example.com
   */
  if (
    value.startsWith("//")
  ) {
    return fallback;
  }


  /*
   * Backslashes can be interpreted
   * inconsistently by URL parsers.
   */
  if (
    value.includes("\\")
  ) {
    return fallback;
  }


  return value;
}