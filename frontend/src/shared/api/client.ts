import axios from "axios";

import { env } from "../config/env";


if (!env.apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not configured.",
  );
}


export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});