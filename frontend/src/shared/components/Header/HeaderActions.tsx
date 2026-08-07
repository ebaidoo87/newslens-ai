import {
  LogIn,
  LogOut,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import NotificationBell from "../../../features/notifications/components/NotificationBell";

export default function HeaderActions() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();
  

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-blue-500
        "
      >
        <LogIn size={17} />

        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden items-center gap-3 sm:flex">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
          "
        >
          <User size={18} />
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">
            {user.username}
          </p>

          <p className="text-xs text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />

        {/* Existing profile, login or logout controls */}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-gray-700
          px-3
          py-2
          text-sm
          text-gray-300
          transition
          hover:border-red-700
          hover:bg-red-950
          hover:text-red-300
        "
      >
        <LogOut size={17} />

        <span className="hidden sm:inline">
          Logout
        </span>
      </button>
    </div>
  );
}