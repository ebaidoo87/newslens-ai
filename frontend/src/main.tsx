import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./app/App";
import "./styles/globals.css";

import { SearchProvider } from "./shared/context/SearchContext";

import { CategoryProvider } from "./shared/context/CategoryContext";

import { AuthProvider } from "./shared/context/AuthContext";


import {
  BrowserRouter
} from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SearchProvider>
            <CategoryProvider>
              <App />
            </CategoryProvider>
          </SearchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);