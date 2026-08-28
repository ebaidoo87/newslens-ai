import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";


export interface UserPreferenceItem {
  preference_type: string;
  preference_value: string;
}


export interface UserPreferencesResponse {
  preferences: UserPreferenceItem[];
}


export async function getPreferences():
Promise<UserPreferencesResponse> {
  const response =
    await apiClient.get<
      UserPreferencesResponse
    >(
      endpoints.preferences.root,
    );

  return response.data;
}


export async function updatePreferences(
  preferences: UserPreferenceItem[],
): Promise<UserPreferencesResponse> {
  const response =
    await apiClient.put<
      UserPreferencesResponse
    >(
      endpoints.preferences.root,
      {
        preferences,
      },
    );

  return response.data;
}


export async function clearPreferences():
Promise<void> {
  await apiClient.delete(
    endpoints.preferences.root,
  );
}