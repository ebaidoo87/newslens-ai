import {
  useContext,
} from "react";

import {
  PreferenceContext,
  type PreferenceContextType,
} from "../context/PreferenceContext";


export function usePreferences():
PreferenceContextType {
  const context =
    useContext(
      PreferenceContext,
    );

  if (!context) {
    throw new Error(
      "usePreferences must be used within PreferenceProvider",
    );
  }

  return context;
}