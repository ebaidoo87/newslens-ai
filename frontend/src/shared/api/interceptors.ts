import { apiClient } from "./client";

apiClient.interceptors.request.use((config) => {
  console.log(
    `[API] ${config.method?.toUpperCase()} ${config.url}`,
  );

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API ERROR]", error);

    return Promise.reject(error);
  },
);