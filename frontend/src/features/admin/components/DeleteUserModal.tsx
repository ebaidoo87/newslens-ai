import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import {
  useToast,
} from "../../../shared/context/ToastContext";

import {
  useDeleteUser,
} from "../hooks/useUsers";


interface DeleteUserModalProps {
  userId: number;
  username: string;
  email: string;
  onClose: () => void;
}


export default function DeleteUserModal({
  userId,
  username,
  email,
  onClose,
}: DeleteUserModalProps) {
  const {
    showToast,
  } = useToast();

  const deleteUser =
    useDeleteUser();


  async function handleDelete() {
    try {
      await deleteUser.mutateAsync(
        userId
      );

      showToast(
        "User account deleted.",
        "success",
      );

      onClose();

    } catch {
      showToast(
        "Unable to delete user.",
        "error",
      );
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-gray-900 p-6">

        <div className="flex items-start justify-between">

          <div className="flex gap-3">
            <AlertTriangle
              className="mt-1 text-red-400"
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                Delete user
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                This action cannot
                be undone.
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


        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-4">

          <p className="font-semibold text-white">
            {username}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {email}
          </p>

        </div>


        <p className="mt-5 text-sm leading-6 text-gray-400">
          Deleting this account will
          permanently remove the user
          and any related NewsLens data
          configured to cascade with
          the account.
        </p>


        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteUser.isPending
            }
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleteUser.isPending
            }
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />

            {deleteUser.isPending
              ? "Deleting..."
              : "Delete account"}
          </button>

        </div>

      </div>

    </div>
  );
}