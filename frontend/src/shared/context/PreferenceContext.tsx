import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import {
  clearPreferences as clearPreferencesRequest,
  getPreferences,
  updatePreferences,
  type UserPreferenceItem,
} from "../services/preferenceApi";


interface PreferenceContextType {
  preferences: UserPreferenceItem[];
  selectedCategories: string[];
  selectedCountries: string[];
  selectedKeywords: string[];
  isLoading: boolean;
  selectedAlerts: string[];
  selectedEmailAlerts: string[];
  savePreferences: (
    preferences: UserPreferenceItem[],
  ) => Promise<void>;
  clearPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}


const PreferenceContext = createContext<
  PreferenceContextType | undefined
>(undefined);


export function PreferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [
    preferences,
    setPreferences,
  ] = useState<UserPreferenceItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const selectedCategories = useMemo(
    () =>
      preferences
        .filter(
          (item) =>
            item.preference_type
            === "category",
        )
        .map(
          (item) =>
            item.preference_value,
        ),
    [preferences],
  );


  const selectedCountries = useMemo(
    () =>
      preferences
        .filter(
          (item) =>
            item.preference_type
            === "country",
        )
        .map(
          (item) =>
            item.preference_value,
        ),
    [preferences],
  );


  const selectedKeywords = useMemo(
    () =>
      preferences
        .filter(
          (item) =>
            item.preference_type
            === "keyword",
        )
        .map(
          (item) =>
            item.preference_value,
        ),
    [preferences],
  );

  const selectedAlerts = useMemo(
    () =>
       preferences
        .filter(
          (item) =>
             item.preference_type
             === "alert",
        )     
        .map(
          (item) =>
            item.preference_value,
      ),
    [preferences],
  );

  const selectedEmailAlerts = useMemo(
    () =>
      preferences
       .filter(
         (item) =>
            item.preference_type === "email_alert",
        )
        .map(
          (item) =>
            item.preference_value,
        ),
    [preferences],
  );


  async function refreshPreferences():
  Promise<void> {
    if (!isAuthenticated) {
      setPreferences([]);
      return;
    }

    setIsLoading(true);

    try {
      const response =
        await getPreferences();

      setPreferences(
        response.preferences,
      );
    } catch {
      setPreferences([]);
    } finally {
      setIsLoading(false);
    }
  }


  async function savePreferences(
    nextPreferences:
    UserPreferenceItem[],
  ): Promise<void> {
    const previousPreferences =
      preferences;

    setPreferences(
      nextPreferences,
    );

    try {
      const response =
        await updatePreferences(
          nextPreferences,
        );

      setPreferences(
        response.preferences,
      );
    } catch (error) {
      setPreferences(
        previousPreferences,
      );

      throw error;
    }
  }


  async function clearPreferences():
  Promise<void> {
    const previousPreferences =
      preferences;

    setPreferences([]);

    try {
      await clearPreferencesRequest();
    } catch (error) {
      setPreferences(
        previousPreferences,
      );

      throw error;
    }
  }


  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setPreferences([]);
      return;
    }

    refreshPreferences();
  }, [
    isAuthenticated,
    isAuthLoading,
  ]);


  return (
    <PreferenceContext.Provider
      value={{
        preferences,
        selectedCategories,
        selectedCountries,
        selectedKeywords,
        selectedAlerts,
        selectedEmailAlerts,
        isLoading,
        savePreferences,
        clearPreferences,
        refreshPreferences,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
}


export function usePreferences():
PreferenceContextType {
  const context =
    useContext(PreferenceContext);
    

  if (!context) {
    throw new Error(
      "usePreferences must be used within PreferenceProvider",
    );
  }

  return context;
}