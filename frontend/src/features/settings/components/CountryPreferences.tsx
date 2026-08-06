import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  LoaderCircle,
} from "lucide-react";

import {
  usePreferences,
} from "../../../shared/context/PreferenceContext";

import {
  useToast,
} from "../../../shared/context/ToastContext";

import type {
  UserPreferenceItem,
} from "../../../shared/services/preferenceApi";


interface CountryOption {
  code: string;
  name: string;
  flag: string;
}


const COUNTRIES: CountryOption[] = [
  {
    code: "gb",
    name: "United Kingdom",
    flag: "🇬🇧",
  },
  {
    code: "us",
    name: "United States",
    flag: "🇺🇸",
  },
  {
    code: "gh",
    name: "Ghana",
    flag: "🇬🇭",
  },
  {
    code: "ng",
    name: "Nigeria",
    flag: "🇳🇬",
  },
  {
    code: "ca",
    name: "Canada",
    flag: "🇨🇦",
  },
  {
    code: "au",
    name: "Australia",
    flag: "🇦🇺",
  },
  {
    code: "in",
    name: "India",
    flag: "🇮🇳",
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
  },
  {
    code: "ie",
    name: "Ireland",
    flag: "🇮🇪",
  },
  {
    code: "za",
    name: "South Africa",
    flag: "🇿🇦",
  },
  {
    code: "jp",
    name: "Japan",
    flag: "🇯🇵",
  },
  {
    code: "sg",
    name: "Singapore",
    flag: "🇸🇬",
  },
  {
    code: "nz",
    name: "New Zealand",
    flag: "🇳🇿",
  },
  {
    code: "qa",
    name: "Qatar",
    flag: "🇶🇦",
  },
  {
    code: "global",
    name: "International",
    flag: "🌍",
  },
];


export default function CountryPreferences() {
  const {
    preferences,
    selectedCountries,
    isLoading,
    savePreferences,
  } = usePreferences();

  const {
    showToast,
  } = useToast();

  const [
    countries,
    setCountries,
  ] = useState<string[]>([]);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  useEffect(() => {
    setCountries(
      selectedCountries,
    );
  }, [selectedCountries]);


  function toggleCountry(
    countryCode: string,
  ) {
    setCountries(
      (currentCountries) =>
        currentCountries.includes(
          countryCode,
        )
          ? currentCountries.filter(
              (code) =>
                code !== countryCode,
            )
          : [
              ...currentCountries,
              countryCode,
            ],
    );
  }


  async function handleSave() {
    setIsSaving(true);

    const nonCountryPreferences =
      preferences.filter(
        (item) =>
          item.preference_type
          !== "country",
      );

    const countryPreferences:
    UserPreferenceItem[] =
      countries.map(
        (countryCode) => ({
          preference_type:
            "country",
          preference_value:
            countryCode,
        }),
      );

    try {
      await savePreferences([
        ...nonCountryPreferences,
        ...countryPreferences,
      ]);

      showToast(
        "Country preferences saved.",
        "success",
      );
    } catch {
      showToast(
        "Unable to save country preferences.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }


  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-center gap-3 text-gray-400">
          <LoaderCircle
            size={20}
            className="animate-spin"
          />

          Loading country preferences...
        </div>
      </section>
    );
  }


  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
      <div>
        <h2 className="text-2xl font-bold">
          Preferred countries
        </h2>

        <p className="mt-2 text-gray-400">
          Choose the countries and regions
          you want NewsLens to prioritize.
        </p>
      </div>


      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {COUNTRIES.map(
          (country) => {
            const selected =
              countries.includes(
                country.code,
              );

            return (
              <button
                key={country.code}
                type="button"
                onClick={() =>
                  toggleCountry(
                    country.code,
                  )
                }
                aria-pressed={selected}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-left
                  transition
                  ${
                    selected
                      ? "border-blue-500 bg-blue-950 text-blue-200"
                      : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">
                    {country.flag}
                  </span>

                  <span className="font-medium">
                    {country.name}
                  </span>
                </span>

                {selected && (
                  <Check size={18} />
                )}
              </button>
            );
          },
        )}
      </div>


      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving && (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          )}

          {isSaving
            ? "Saving..."
            : "Save countries"}
        </button>

        <p className="text-sm text-gray-500">
          {countries.length === 1
            ? "1 country selected"
            : `${countries.length} countries selected`}
        </p>
      </div>
    </section>
  );
}