import React from "react";
import ReactDOM from "react-dom/client";


import App from "./app/App";
import "./styles/globals.css";

import {
  SearchProvider,
} from "./shared/context/SearchProvider";

import { CategoryProvider } from "./shared/context/CategoryProvider";

import {
  AuthProvider,
} from "./shared/context/AuthProvider";

import { setupApiInterceptors } from "./shared/api/interceptors";

import {
  BookmarkProvider,
} from "./shared/context/BookmarkProvider";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter
} from "react-router-dom";

import {
  ToastProvider,
} from "./shared/context/ToastProvider";

import {
  ReadingHistoryProvider,
} from "./shared/context/ReadingHistoryProvider";

import {
  PreferenceProvider,
} from "./shared/context/PreferenceProvider";

import {
  NotificationProvider,
} from "./shared/context/NotificationProvider";


import {
  queryClient,
} from "./shared/lib/queryClient";

setupApiInterceptors();

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <NotificationProvider>
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
            </NotificationProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);