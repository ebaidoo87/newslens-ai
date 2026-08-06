import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  LoaderCircle,
  Plus,
  X,
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


const MAX_KEYWORDS = 15;
const MAX_KEYWORD_LENGTH = 50;


function normalizeKeyword(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


function formatKeyword(
  value: string,
): string {
  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase()
        + word.slice(1),
    )
    .join(" ");
}


export default function KeywordPreferences() {
  const {
    preferences,
    selectedKeywords,
    isLoading,
    savePreferences,
  } = usePreferences();

  const {
    showToast,
  } = useToast();

  const [keyword, setKeyword] =
    useState("");

  const [keywords, setKeywords] =
    useState<string[]>([]);

  const [isSaving, setIsSaving] =
    useState(false);


  useEffect(() => {
    setKeywords(selectedKeywords);
  }, [selectedKeywords]);


  function addKeyword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalized =
      normalizeKeyword(keyword);

    if (!normalized) {
      return;
    }

    if (
      normalized.length
      > MAX_KEYWORD_LENGTH
    ) {
      showToast(
        `Keywords cannot exceed ${MAX_KEYWORD_LENGTH} characters.`,
        "error",
      );

      return;
    }

    if (keywords.includes(normalized)) {
      showToast(
        "That keyword has already been added.",
        "info",
      );

      setKeyword("");
      return;
    }

    if (
      keywords.length
      >= MAX_KEYWORDS
    ) {
      showToast(
        `You can add up to ${MAX_KEYWORDS} keywords.`,
        "error",
      );

      return;
    }

    setKeywords(
      (currentKeywords) => [
        ...currentKeywords,
        normalized,
      ],
    );

    setKeyword("");
  }


  function removeKeyword(
    keywordToRemove: string,
  ) {
    setKeywords(
      (currentKeywords) =>
        currentKeywords.filter(
          (item) =>
            item !== keywordToRemove,
        ),
    );
  }


  async function handleSave() {
    setIsSaving(true);

    const nonKeywordPreferences =
      preferences.filter(
        (item) =>
          item.preference_type
          !== "keyword",
      );

    const keywordPreferences:
    UserPreferenceItem[] =
      keywords.map(
        (keywordValue) => ({
          preference_type:
            "keyword",
          preference_value:
            keywordValue,
        }),
      );

    try {
      await savePreferences([
        ...nonKeywordPreferences,
        ...keywordPreferences,
      ]);

      showToast(
        "Topic preferences saved.",
        "success",
      );
    } catch {
      showToast(
        "Unable to save topic preferences.",
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

          Loading topic preferences...
        </div>
      </section>
    );
  }


  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
      <div>
        <h2 className="text-2xl font-bold">
          Favourite topics
        </h2>

        <p className="mt-2 text-gray-400">
          Add topics, companies, people,
          technologies, or events you want
          NewsLens to prioritize.
        </p>
      </div>


      <form
        onSubmit={addKeyword}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={keyword}
          onChange={(event) =>
            setKeyword(
              event.target.value,
            )
          }
          maxLength={MAX_KEYWORD_LENGTH}
          placeholder="Example: Artificial Intelligence"
          className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={
            !keyword.trim()
            || keywords.length
              >= MAX_KEYWORDS
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500 px-5 py-3 font-semibold text-blue-300 transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />

          Add topic
        </button>
      </form>


      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-gray-500">
        <span>
          Add up to {MAX_KEYWORDS} topics.
        </span>

        <span>
          {keywords.length}/{MAX_KEYWORDS}
        </span>
      </div>


      {keywords.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {keywords.map(
            (keywordValue) => (
              <div
                key={keywordValue}
                className="inline-flex items-center gap-2 rounded-full border border-blue-700 bg-blue-950 px-4 py-2 text-sm text-blue-200"
              >
                <span>
                  {formatKeyword(
                    keywordValue,
                  )}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeKeyword(
                      keywordValue,
                    )
                  }
                  aria-label={
                    `Remove ${keywordValue}`
                  }
                  className="rounded-full p-0.5 transition hover:bg-blue-800 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-gray-700 px-5 py-8 text-center text-gray-500">
          No favourite topics added yet.
        </div>
      )}


      <div className="mt-6">
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
            : "Save topics"}
        </button>
      </div>
    </section>
  );
}