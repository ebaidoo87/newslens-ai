import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  KeyRound,
  X,
} from "lucide-react";

import {
  useToast,
} from "../../../shared/hooks/useToast";

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

  const passwordInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  useEffect(
    () => {
      passwordInputRef.current?.focus();

      function handleKeyDown(
        event: KeyboardEvent,
      ) {
        if (
          event.key === "Escape"
          && !resetPassword.isPending
        ) {
          onClose();
        }
      }

      document.addEventListener(
        "keydown",
        handleKeyDown,
      );

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        "hidden";

      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown,
        );

        document.body.style.overflow =
          previousOverflow;
      };
    },
    [
      onClose,
      resetPassword.isPending,
    ],
  );


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
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        aria-describedby="reset-password-description"
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-gray-800
          bg-gray-900
          p-6
        "
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <KeyRound
              className="text-blue-400"
              aria-hidden="true"
            />

            <div>
              <h2
                id="reset-password-title"
                className="text-xl font-bold"
              >
                Reset Password
              </h2>

              <p
                id="reset-password-description"
                className="mt-1 text-sm text-gray-400"
              >
                Reset password for{" "}
                {username}
              </p>
            </div>
          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={
              resetPassword.isPending
            }
            aria-label="Close reset password dialog"
            className="
              rounded
              text-gray-500
              transition
              hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              disabled:opacity-50
            "
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
          aria-busy={
            resetPassword.isPending
          }
        >
          <div>
            <label
              htmlFor="admin-new-password"
              className="text-sm text-gray-400"
            >
              New password
            </label>

            <input
              ref={passwordInputRef}
              id="admin-new-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-700
                bg-gray-950
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                focus-visible:ring-2
                focus-visible:ring-blue-500
              "
            />
          </div>


          <div>
            <label
              htmlFor="admin-confirm-password"
              className="text-sm text-gray-400"
            >
              Confirm new password
            </label>

            <input
              id="admin-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              required
              minLength={8}
              autoComplete="new-password"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-700
                bg-gray-950
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                focus-visible:ring-2
                focus-visible:ring-blue-500
              "
            />
          </div>


          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={
                resetPassword.isPending
              }
              className="
                rounded-lg
                border
                border-gray-700
                px-4
                py-2
                text-sm
                text-gray-300
                hover:bg-gray-800
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                disabled:opacity-50
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                resetPassword.isPending
              }
              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-500
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-400
                disabled:opacity-50
              "
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