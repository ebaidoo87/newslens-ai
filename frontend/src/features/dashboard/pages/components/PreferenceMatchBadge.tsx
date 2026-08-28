import {
  Sparkles,
} from "lucide-react";

import type {
  Article,
} from "../../../news/types/article";

import {
  getPreferenceScore,
} from "../utils/rankArticlesByPreferences";

import type {
  PreferenceSignals,
} from "../utils/rankArticlesByPreferences";


interface PreferenceMatchBadgeProps {
  article: Article;
  preferences:
    PreferenceSignals;
}


export default function PreferenceMatchBadge({
  article,
  preferences,
}: PreferenceMatchBadgeProps) {
  const preferenceScore =
    getPreferenceScore(
      article,
      preferences,
    );


  if (preferenceScore <= 0) {
    return null;
  }


  return (
    <span
      className="
        inline-flex
        w-fit
        items-center
        gap-1.5
        rounded-full
        border
        border-purple-800
        bg-purple-950/40
        px-3
        py-1
        text-xs
        font-medium
        text-purple-300
      "
      aria-label={
        "This article matches "
        + "your selected interests"
      }
    >
      <Sparkles
        size={13}
        aria-hidden="true"
      />

      Matches your interests
    </span>
  );
}