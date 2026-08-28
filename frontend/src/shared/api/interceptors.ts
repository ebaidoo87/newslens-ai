import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "./client";


export const TOKEN_STORAGE_KEY =
  "newslens_access_token";


let interceptorsConfigured = false;

export const AUTH_SESSION_EXPIRED_EVENT =
  "newslens:session-expired";


export function setupApiInterceptors(): void {
  if (interceptorsConfigured) {
    return;
  }

  apiClient.interceptors.request.use(
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


  apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status =
      error.response?.status;

    if (status === 401) {
      localStorage.removeItem(
        TOKEN_STORAGE_KEY,
      );
      window.dispatchEvent(
        new Event(
          AUTH_SESSION_EXPIRED_EVENT,
        ),
      );

      const path =
        window.location.pathname;

      const isPublicAuthPage =
        path === "/login"
        || path === "/register";

      if (!isPublicAuthPage) {
        window.location.assign(
          "/login",
        );
      }
    }

    return Promise.reject(error);
  },
);


  interceptorsConfigured = true;
}