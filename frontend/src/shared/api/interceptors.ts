import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { api } from "../services/api";

export const TOKEN_STORAGE_KEY =
  "newslens_access_token";

export function setupApiInterceptors() {
  api.interceptors.request.use(
    (
      config: InternalAxiosRequestConfig,
    ) => {
      const token = localStorage.getItem(
        TOKEN_STORAGE_KEY,
      );

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) =>
      Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,

    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(
          TOKEN_STORAGE_KEY,
        );

        if (
          window.location.pathname !== "/login"
        ) {
          window.location.assign("/login");
        }
      }

      return Promise.reject(error);
    },
  );
}