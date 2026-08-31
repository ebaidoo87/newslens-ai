import {
  lazy,
  Suspense,
} from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../../shared/layouts/MainLayout";

import ProtectedRoute from "../../features/auth/components/ProtectedRoute";

import AdminRoute from "./AdminRoute";

import PageLoadingFallback from "../../shared/components/PageLoadingFallback";

const DashboardPage =
  lazy(
    () =>
      import(
        "../../features/dashboard/pages/DashboardPage"
      ),
  );

const SearchPage =
  lazy(
    () =>
      import(
        "../../features/search/pages/SearchPage"
      ),
  );

const NewsPage =
  lazy(
    () =>
      import(
        "../../features/news/pages/NewsPage"
      ),
  );

const ArticleDetailPage =
  lazy(
    () =>
      import(
        "../../features/articles/pages/ArticleDetailPage"
      ),
  );

const LoginPage =
  lazy(
    () =>
      import(
        "../../features/auth/pages/LoginPage"
      ),
  );

const RegisterPage =
  lazy(
    () =>
      import(
        "../../features/auth/pages/RegisterPage"
      ),
  );

const SettingsPage =
  lazy(
    () =>
      import(
        "../../features/settings/pages/SettingsPage"
      ),
  );

const SavedArticlesPage =
  lazy(
    () =>
      import(
        "../../features/bookmarks/pages/SavedArticlesPage"
      ),
  );

const RecentlyViewedPage =
  lazy(
    () =>
      import(
        "../../features/history/pages/RecentlyViewedPage"
      ),
  );

const RecommendedPage =
  lazy(
    () =>
      import(
        "../../features/recommendations/pages/RecommendedPage"
      ),
  );

const TrendingPage =
  lazy(
    () =>
      import(
        "../../features/trending/pages/TrendingPage"
      ),
  );

const DiscoverPage =
  lazy(
    () =>
      import(
        "../../features/discovery/pages/DiscoverPage"
      ),
  );

const NotificationsPage =
  lazy(
    () =>
      import(
        "../../features/notifications/pages/NotificationsPage"
      ),
  );

const EmailMonitoringPage =
  lazy(
    () =>
      import(
        "../../features/email-monitoring/pages/EmailMonitoringPage"
      ),
  );

const AdminDashboardPage =
  lazy(
    () =>
      import(
        "../../features/admin/pages/AdminDashboardPage"
      ),
  );

const AdminUsersPage =
  lazy(
    () =>
      import(
        "../../features/admin/pages/AdminUsersPage"
      ),
  );

const AdminAuditPage =
  lazy(
    () =>
      import(
        "../../features/admin/pages/AdminAuditPage"
      ),
  );

const NotFoundPage =
  lazy(
    () =>
      import(
        "../../features/not-found/pages/NotFoundPage"
      ),
  );




export default function AppRouter() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <PageLoadingFallback />
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage />
            }
          />

          <Route
            path="/search"
            element={
              <SearchPage />
            }
          />

          <Route
            path="/news"
            element={
              <NewsPage />
            }
          />

          <Route
            path="/articles/:id"
            element={
              <ArticleDetailPage />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/trending"
            element={
              <TrendingPage />
            }
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
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
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

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}