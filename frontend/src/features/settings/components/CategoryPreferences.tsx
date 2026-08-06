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


const CATEGORIES = [
  "technology",
  "business",
  "money",
  "sports",
  "science",
  "health",
  "food",
  "lifestyle",
  "entertainment",
  "general",
];


function formatCategory(
  category: string,
): string {
  return (
    category.charAt(0).toUpperCase()
    + category.slice(1)
  );
}


export default function CategoryPreferences() {
  const {
    preferences,
    selectedCategories,
    isLoading,
    savePreferences,
  } = usePreferences();

  const {
    showToast,
  } = useToast();

  const [
    categories,
    setCategories,
  ] = useState<string[]>([]);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  useEffect(() => {
    setCategories(
      selectedCategories,
    );
  }, [selectedCategories]);


  function toggleCategory(
    category: string,
  ) {
    setCategories(
      (currentCategories) =>
        currentCategories.includes(
          category,
        )
          ? currentCategories.filter(
              (item) =>
                item !== category,
            )
          : [
              ...currentCategories,
              category,
            ],
    );
  }


  async function handleSave() {
    setIsSaving(true);

    const nonCategoryPreferences =
      preferences.filter(
        (item) =>
          item.preference_type
          !== "category",
      );

    const categoryPreferences:
    UserPreferenceItem[] =
      categories.map(
        (category) => ({
          preference_type:
            "category",
          preference_value:
            category,
        }),
      );

    try {
      await savePreferences([
        ...nonCategoryPreferences,
        ...categoryPreferences,
      ]);

      showToast(
        "Category preferences saved.",
        "success",
      );
    } catch {
      showToast(
        "Unable to save category preferences.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }


  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-center gap-3 text-gray-400">
          <LoaderCircle
            size={20}
            className="animate-spin"
          />

          Loading preferences...
        </div>
      </div>
    );
  }


  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
      <div>
        <h2 className="text-2xl font-bold">
          Favourite categories
        </h2>

        <p className="mt-2 text-gray-400">
          Select the topics you want
          NewsLens to prioritize.
        </p>
      </div>


      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map(
          (category) => {
            const selected =
              categories.includes(
                category,
              );

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  toggleCategory(
                    category,
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
                <span className="font-medium">
                  {formatCategory(
                    category,
                  )}
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
            : "Save categories"}
        </button>

        <p className="text-sm text-gray-500">
          {categories.length === 1
            ? "1 category selected"
            : `${categories.length} categories selected`}
        </p>
      </div>
    </section>
  );
}