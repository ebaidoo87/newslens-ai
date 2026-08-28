import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../shared/hooks/useAuth";


interface AdminRouteProps {
  children: ReactNode;
}


export default function AdminRoute({
  children,
}: AdminRouteProps) {
  const location =
    useLocation();

  const {
    isAuthenticated,
    isAdmin,
    isLoading,
  } = useAuth();


  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          text-gray-400
        "
      >
        Checking permissions...
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname:
              location.pathname,
            search:
              location.search,
          },
        }}
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