import {
  useState,
} from "react";

import {
  KeyRound,
  X,
} from "lucide-react";

import {
  useToast,
} from "../../../shared/context/ToastContext";

import {
  useResetUserPassword,
} from "../hooks/useUsers";


interface ResetPasswordModalProps {
  userId: number;
  username: string;
  onClose: () => void;
}


export default function ResetPasswordModal({
  userId,
  username,
  onClose,
}: ResetPasswordModalProps) {
  const {
    showToast,
  } = useToast();

  const resetPassword =
    useResetUserPassword();

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      password
      !== confirmPassword
    ) {
      showToast(
        "Passwords do not match.",
        "error",
      );

      return;
    }

    if (password.length < 8) {
      showToast(
        "Password must be at least 8 characters.",
        "error",
      );

      return;
    }

    try {
      await resetPassword.mutateAsync({
        userId,
        payload: {
          new_password: password,
          confirm_new_password:
            confirmPassword,
        },
      });

      showToast(
        "Password reset successfully.",
        "success",
      );

      onClose();

    } catch {
      showToast(
        "Unable to reset password.",
        "error",
      );
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">
            <KeyRound className="text-blue-400" />

            <div>
              <h2 className="text-xl font-bold">
                Reset Password
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Reset password for{" "}
                {username}
              </p>
            </div>
          </div>


          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition hover:text-white"
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <div>
            <label className="text-sm text-gray-400">
              New password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>


          <div>
            <label className="text-sm text-gray-400">
              Confirm new password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>


          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                resetPassword.isPending
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {resetPassword.isPending
                ? "Resetting..."
                : "Reset password"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}