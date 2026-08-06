interface CountryMetadata {
  name: string;
  flag: string;
}

const COUNTRIES: Record<
  string,
  CountryMetadata
> = {
  global: {
    name: "International",
    flag: "🌍",
  },
  us: {
    name: "United States",
    flag: "🇺🇸",
  },
  gb: {
    name: "United Kingdom",
    flag: "🇬🇧",
  },
  ca: {
    name: "Canada",
    flag: "🇨🇦",
  },
  au: {
    name: "Australia",
    flag: "🇦🇺",
  },
  in: {
    name: "India",
    flag: "🇮🇳",
  },
  fr: {
    name: "France",
    flag: "🇫🇷",
  },
  de: {
    name: "Germany",
    flag: "🇩🇪",
  },
  ie: {
    name: "Ireland",
    flag: "🇮🇪",
  },
  za: {
    name: "South Africa",
    flag: "🇿🇦",
  },
  ng: {
    name: "Nigeria",
    flag: "🇳🇬",
  },
  gh: {
    name: "Ghana",
    flag: "🇬🇭",
  },
  jp: {
    name: "Japan",
    flag: "🇯🇵",
  },
  sg: {
    name: "Singapore",
    flag: "🇸🇬",
  },
  nz: {
    name: "New Zealand",
    flag: "🇳🇿",
  },
  qa: {
    name: "Qatar",
    flag: "🇶🇦",
  },
};

const DEFAULT_COUNTRY: CountryMetadata = {
  name: "International",
  flag: "🌍",
};

export function getCountryMetadata(
  countryCode: string | null | undefined,
): CountryMetadata {
  if (!countryCode) {
    return DEFAULT_COUNTRY;
  }

  return (
    COUNTRIES[countryCode.toLowerCase()]
    ?? DEFAULT_COUNTRY
  );
}