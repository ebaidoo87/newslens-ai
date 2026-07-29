import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../../shared/layouts/MainLayout";

import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import SearchPage from "../../features/search/pages/SearchPage";
import NewsPage from "../../features/news/pages/NewsPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import SettingsPage from "../../features/settings/pages/SettingsPage";
import NotFoundPage from "../../features/not-found/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}