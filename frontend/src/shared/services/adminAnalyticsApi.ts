import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";


export interface AdminAnalyticsSummary {
  users: {
    total: number;
    active: number;
    suspended: number;
    admins: number;
    regular: number;
    new_7d: number;
    new_30d: number;
  };

  articles: {
    total: number;
    new_7d: number;
  };

  emails: {
    total: number;
    delivered: number;
    failed: number;
  };

  audit: {
    events_7d: number;
  };
}


export async function getAdminAnalyticsSummary():
Promise<AdminAnalyticsSummary> {
  const response =
    await apiClient.get<
      AdminAnalyticsSummary
    >(
      endpoints.admin.analyticsSummary,
    );

  return response.data;
}