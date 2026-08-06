import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./app/App";
import "./styles/globals.css";

import { SearchProvider } from "./shared/context/SearchContext";

import { CategoryProvider } from "./shared/context/CategoryContext";

import { AuthProvider } from "./shared/context/AuthContext";

import { setupApiInterceptors } from "./shared/api/interceptors";

import {
  BookmarkProvider,
} from "./shared/context/BookmarkContext";


import {
  BrowserRouter
} from "react-router-dom";

import {
  ToastProvider,
} from "./shared/context/ToastContext";

import {
  ReadingHistoryProvider,
} from "./shared/context/ReadingHistoryContext";

import {
  PreferenceProvider,
} from "./shared/context/PreferenceContext";


const queryClient = new QueryClient();

setupApiInterceptors();

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BookmarkProvider>
              <ReadingHistoryProvider>
                <PreferenceProvider>
                  <SearchProvider>
                    <CategoryProvider>
                      <App />
                    </CategoryProvider>
                  </SearchProvider>
                </PreferenceProvider>
              </ReadingHistoryProvider>
            </BookmarkProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);