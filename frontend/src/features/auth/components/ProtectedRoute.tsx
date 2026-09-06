import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../../shared/hooks/useAuth";


interface ProtectedRouteProps {
  children: ReactNode;
}


export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location =
    useLocation();

  const {
    isAuthenticated,
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
        Restoring your session...
      </div>
    );
  }


  if (!isAuthenticated) {
    const intendedPath =
      `${location.pathname}${location.search}`;

    const loginPath =
      `/login?redirect=${encodeURIComponent(
        intendedPath,
      )}`;

    return (
      <Navigate
        to={loginPath}
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


  return children;
}