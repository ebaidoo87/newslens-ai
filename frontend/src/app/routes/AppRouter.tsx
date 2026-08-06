import { Routes, Route } from "react-router-dom";

import MainLayout from "../../shared/layouts/MainLayout";

import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import SearchPage from "../../features/search/pages/SearchPage";
import NewsPage from "../../features/news/pages/NewsPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import SettingsPage from "../../features/settings/pages/SettingsPage";
import NotFoundPage from "../../features/not-found/pages/NotFoundPage";

import ArticleDetailPage from "../../features/articles/pages/ArticleDetailPage";

import ProtectedRoute from "../../features/auth/components/ProtectedRoute";

import RegisterPage from "../../features/auth/pages/RegisterPage";

import SavedArticlesPage from "../../features/bookmarks/pages/SavedArticlesPage";

import RecentlyViewedPage from "../../features/history/pages/RecentlyViewedPage";

export default function AppRouter() {
  return (
    <MainLayout>
      <Routes>

        <Route 
          path="/" 
          element={<DashboardPage />} 
        />

        <Route 
          path="/search" 
          element={<SearchPage />} 
        />

        <Route 
          path="/news" 
          element={<NewsPage />} 
        />

        <Route
          path="/articles/:id"
          element={<ArticleDetailPage />}
        />

        <Route 
          path="/login" 
          element={<LoginPage />} 
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route 
          path="/settings" 
          element={ 
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>} 
        />

        <Route 
          path="*" 
          element={<NotFoundPage />} 
        />
        
        <Route
          path="/saved"
          element={
        <SavedArticlesPage />
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <RecentlyViewedPage />
          </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}