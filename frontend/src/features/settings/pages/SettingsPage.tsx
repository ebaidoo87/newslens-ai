import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

import { useAuth } from "../../../shared/context/AuthContext";

import {
  changePassword,
  updateCurrentUser,
} from "../../../shared/services/authApi";

import { useNavigate } from "react-router-dom";

import {
  logoutAllDevices,
} from "../../../shared/services/authApi";

import CategoryPreferences from "../components/CategoryPreferences";


export default function SettingsPage() {
  const {
  user,
  refreshUser,
  logout,
  } = useAuth();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [
    currentPasswordForChange,
    setCurrentPasswordForChange,
  ] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmNewPassword,
    setConfirmNewPassword,
  ] = useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");

  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false);


  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const navigate = useNavigate();

  const [
  isLoggingOutEverywhere,
  setIsLoggingOutEverywhere,
] = useState(false);

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await updateCurrentUser({
        username,
        email,
        current_password:
          currentPassword,
      });

      await refreshUser();

      setCurrentPassword("");

      setSuccess(
        "Your profile was updated successfully.",
      );
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const detail =
          requestError.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to update profile.",
        );
      } else {
        setError(
          "Unable to update profile.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }


  async function handlePasswordChange(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError(
        "New passwords do not match.",
      );

      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters.",
      );

      return;
    }

    if (
      currentPasswordForChange
      === newPassword
    ) {
      setPasswordError(
        "New password must be different from the current password.",
      );

      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        current_password:
          currentPasswordForChange,
        new_password:
          newPassword,
        confirm_new_password:
          confirmNewPassword,
      });

      logout();

      navigate("/login", {
        replace: true,
        state: {
          passwordChanged: true,
        },
      });

      setCurrentPasswordForChange("");
      setNewPassword("");
      setConfirmNewPassword("");

      setPasswordSuccess(
        "Your password was changed successfully.",
      );
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const detail =
          requestError.response?.data?.detail;

        setPasswordError(
          typeof detail === "string"
            ? detail
            : "Unable to change password.",
        );
      } else {
        setPasswordError(
          "Unable to change password.",
        );
      }
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleLogoutAllDevices() {
    setIsLoggingOutEverywhere(true);

    try {
      await logoutAllDevices();

    logout();

    navigate("/login", {
      replace: true,
    });
  } finally {
    setIsLoggingOutEverywhere(false);
  }
}


  if (!user) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading account settings...
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-2xl space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Account settings
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your profile and account security.
        </p>
      </div>

      <CategoryPreferences />


      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Profile details
          </h2>


          <p className="mt-2 text-gray-400">
            Update your username and email address.
          </p>
        </div>


        {success && (
          <div className="mb-6 rounded-lg border border-green-800 bg-green-950 p-4 text-green-200">
            {success}
          </div>
        )}


        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-200">
            {error}
          </div>
        )}


        <form
          onSubmit={handleProfileSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="settings-username"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Username
            </label>

            <input
              id="settings-username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              required
              minLength={3}
              maxLength={100}
              autoComplete="username"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>


          <div>
            <label
              htmlFor="settings-email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>

            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>


          <div>
            <label
              htmlFor="profile-current-password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Current password
            </label>

            <input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              required
              autoComplete="current-password"
              placeholder="Confirm your current password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">
              Your current password is required
              to save profile changes.
            </p>
          </div>


          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : "Save profile changes"}
          </button>
        </form>

      </div>


      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Change password
          </h2>

          <p className="mt-2 text-gray-400">
            Use a strong password you do not use
            anywhere else.
          </p>
        </div>


        {passwordSuccess && (
          <div className="mb-6 rounded-lg border border-green-800 bg-green-950 p-4 text-green-200">
            {passwordSuccess}
          </div>
        )}


        {passwordError && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-200">
            {passwordError}
          </div>
        )}


        <form
          onSubmit={handlePasswordChange}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="password-current"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Current password
            </label>

            <input
              id="password-current"
              type="password"
              value={currentPasswordForChange}
              onChange={(event) =>
                setCurrentPasswordForChange(
                  event.target.value
                )
              }
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>


          <div>
            <label
              htmlFor="password-new"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              New password
            </label>

            <input
              id="password-new"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>


          <div>
            <label
              htmlFor="password-confirm"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Confirm new password
            </label>

            <input
              id="password-confirm"
              type="password"
              value={confirmNewPassword}
              onChange={(event) =>
                setConfirmNewPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>


          <button
            type="submit"
            disabled={isChangingPassword}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChangingPassword
              ? "Changing password..."
              : "Change password"}
          </button>
        </form>

      </div>
        <div className="rounded-2xl border border-red-900 bg-gray-900 p-8">
          <div>
            <h2 className="text-2xl font-bold">
              Active sessions
            </h2>

            <p className="mt-2 text-gray-400">
              Invalidate every NewsLens access token
              currently associated with your account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogoutAllDevices}
            disabled={isLoggingOutEverywhere}
            className="mt-6 rounded-lg border border-red-700 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOutEverywhere
              ? "Logging out..."
              : "Log out from all devices"}
          </button>
      </div>
    </div>
  );
}