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

import RecommendedPage from "../../features/recommendations/pages/RecommendedPage";

import TrendingPage from "../../features/trending/pages/TrendingPage";

import DiscoverPage from "../../features/discovery/pages/DiscoverPage";

import NotificationsPage from "../../features/notifications/pages/NotificationsPage";

import EmailMonitoringPage from "../../features/email-monitoring/pages/EmailMonitoringPage";

import AdminRoute from "./AdminRoute";

import AdminDashboardPage from "../../features/admin/pages/AdminDashboardPage";

import AdminUsersPage from "../../features/admin/pages/AdminUsersPage";

import AdminAuditPage from "../../features/admin/pages/AdminAuditPage";

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
          path="/recommended"
          element={
            <ProtectedRoute>
              <RecommendedPage />
            </ProtectedRoute>
          }
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

        <Route
          path="/trending"
          element={<TrendingPage />}
        />

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/email-monitoring"
          element={
            <AdminRoute>
              <EmailMonitoringPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/audit"
          element={
            <AdminRoute>
              <AdminAuditPage />
            </AdminRoute>
          }
        />
    
      </Routes>
    </MainLayout>
  );
}