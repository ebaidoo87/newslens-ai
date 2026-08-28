import {
  createContext,
} from "react";

import type {
  UserPreferenceItem,
} from "../services/preferenceApi";


export interface PreferenceContextType {
  preferences: UserPreferenceItem[];

  selectedCategories: string[];
  selectedCountries: string[];
  selectedKeywords: string[];
  selectedAlerts: string[];
  selectedEmailAlerts: string[];

  isLoading: boolean;

  savePreferences: (
    preferences: UserPreferenceItem[],
  ) => Promise<void>;

  clearPreferences:
    () => Promise<void>;

  refreshPreferences:
    () => Promise<void>;
}


export const PreferenceContext =
  createContext<
    PreferenceContextType | undefined
  >(undefined);