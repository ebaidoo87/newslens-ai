import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../shared/context/AuthContext";


interface AdminRouteProps {
  children: ReactNode;
}


export default function AdminRoute({
  children,
}: AdminRouteProps) {
  const {
    isAuthenticated,
    isAdmin,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-400">
        Checking permissions...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}