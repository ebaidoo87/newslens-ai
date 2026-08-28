import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  clearPreferences as clearPreferencesRequest,
  getPreferences,
  updatePreferences,
  type UserPreferenceItem,
} from "../services/preferenceApi";

import {
  PreferenceContext,
} from "./PreferenceContext";


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
            item.preference_type
            === "email_alert",
        )
        .map(
          (item) =>
            item.preference_value,
        ),
    [preferences],
  );


  const refreshPreferences =
    useCallback(
      async (): Promise<void> => {
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
      },
      [isAuthenticated],
    );


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

    void refreshPreferences();
  }, [
    isAuthenticated,
    isAuthLoading,
    refreshPreferences,
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