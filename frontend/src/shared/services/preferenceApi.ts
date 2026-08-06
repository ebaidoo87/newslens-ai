import { api } from "./api";


export type PreferenceType =
  | "category"
  | "country"
  | "keyword";


export interface UserPreferenceItem {
  preference_type: PreferenceType;
  preference_value: string;
}


export interface UserPreferencesResponse {
  preferences: UserPreferenceItem[];
}


export async function getPreferences():
Promise<UserPreferencesResponse> {
  const response =
    await api.get<UserPreferencesResponse>(
      "/preferences",
    );

  return response.data;
}


export async function updatePreferences(
  preferences: UserPreferenceItem[],
): Promise<UserPreferencesResponse> {
  const response =
    await api.put<UserPreferencesResponse>(
      "/preferences",
      {
        preferences,
      },
    );

  return response.data;
}


export async function clearPreferences():
Promise<void> {
  await api.delete("/preferences");
}