
import ResetPasswordModal from "../components/ResetPasswordModal";

import {
  KeyRound,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import DeleteUserModal from "../components/DeleteUserModal";

import {
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "../../../shared/context/AuthContext";

import {
  useToast,
} from "../../../shared/context/ToastContext";

import {
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from "../hooks/useUsers";

import type {
  UserRole,
} from "../../../shared/services/adminUsersApi";


type RoleFilter =
  | "all"
  | UserRole;



export default function AdminUsersPage() {
  const {
    user: currentUser,
  } = useAuth();

  const {
    showToast,
  } = useToast();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useUsers();

  const updateRole =
    useUpdateUserRole();

  const updateStatus =
    useUpdateUserStatus();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<RoleFilter>(
    "all",
  );


  const filteredUsers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesSearch =
            !normalizedSearch
            || user.username
              .toLowerCase()
              .includes(
                normalizedSearch,
              )
            || user.email
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesRole =
            roleFilter === "all"
            || user.role
              === roleFilter;

          return (
            matchesSearch
            && matchesRole
          );
        },
      );
    }, [
      users,
      search,
      roleFilter,
    ]);

    const [
        passwordResetUser,
        setPasswordResetUser,
        ] = useState<{
        id: number;
        username: string;
        } | null>(null);

    const [
        deleteTarget,
        setDeleteTarget,
        ] = useState<{
        id: number;
        username: string;
        email: string;
        } | null>(null);


  async function handleRoleChange(
    userId: number,
    currentRole: UserRole,
  ) {
    const nextRole: UserRole =
      currentRole === "admin"
        ? "user"
        : "admin";

    try {
      await updateRole.mutateAsync({
        userId,
        role: nextRole,
      });

      showToast(
        nextRole === "admin"
          ? "User promoted to admin."
          : "Admin demoted to user.",
        "success",
      );
    } catch {
      showToast(
        "Unable to update user role.",
        "error",
      );
    }
  }


  async function handleStatusChange(
    userId: number,
    isActive: boolean,
  ) {
    const nextStatus =
      !isActive;

    try {
      await updateStatus.mutateAsync({
        userId,
        isActive: nextStatus,
      });

      showToast(
        nextStatus
          ? "User account activated."
          : "User account suspended.",
        "success",
      );
    } catch {
      showToast(
        "Unable to update account status.",
        "error",
      );
    }
  }


  if (isLoading) {
    return (
      <div className="py-16 text-center text-gray-400">
        Loading users...
      </div>
    );
  }


  if (isError) {
    return (
      <div className="py-16 text-center text-red-400">
        Unable to load users.
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <div>
        <div className="flex items-center gap-3">
          <Users className="text-blue-400" />

          <h1 className="text-3xl font-bold">
            User Management
          </h1>
        </div>

        <p className="mt-2 text-gray-400">
          Search users, manage roles,
          and control account access.
        </p>
      </div>


      <div className="flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search username or email..."
            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
          />
        </div>


        <select
          value={roleFilter}
          onChange={(event) => {
            const value =
              event.target.value;

            if (
              value === "all"
              || value === "admin"
              || value === "user"
            ) {
              setRoleFilter(value);
            }
          }}
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="all">
            All roles
          </option>

          <option value="admin">
            Admins
          </option>

          <option value="user">
            Users
          </option>
        </select>

      </div>


      <div className="text-sm text-gray-500">
        Showing{" "}
        {filteredUsers.length} of{" "}
        {users.length} users
      </div>


      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b border-gray-800 bg-gray-950/50">

              <tr className="text-sm text-gray-400">

                <th className="px-5 py-4">
                  User
                </th>

                <th className="px-5 py-4">
                  Email
                </th>

                <th className="px-5 py-4">
                  Role
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Joined
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.map(
                (user) => {
                  const isCurrentUser =
                    user.id
                    === currentUser?.id;

                  const isUpdatingRole =
                    updateRole.isPending
                    && updateRole.variables
                      ?.userId
                      === user.id;

                  const isUpdatingStatus =
                    updateStatus.isPending
                    && updateStatus.variables
                      ?.userId
                      === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-800 last:border-b-0"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800">
                            {user.role
                            === "admin" ? (
                              <Shield
                                size={17}
                                className="text-blue-400"
                              />
                            ) : (
                              <UserRound
                                size={17}
                                className="text-gray-400"
                              />
                            )}
                          </div>


                          <div>
                            <p className="font-medium text-white">
                              {
                                user.username
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              ID #{user.id}
                            </p>
                          </div>

                        </div>

                      </td>


                      <td className="px-5 py-4 text-gray-300">
                        {user.email}
                      </td>


                      <td className="px-5 py-4">

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${
                              user.role
                              === "admin"
                                ? "bg-blue-950 text-blue-300"
                                : "bg-gray-800 text-gray-300"
                            }
                          `}
                        >
                          {user.role}
                        </span>

                      </td>


                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${
                              user.is_active
                                ? "bg-white-950 text-green-300"
                                : "bg-white-950 text-red-300"
                            }
                          `}
                        >
                          <span>
                            {user.is_active
                              ? "🟢"
                              : "🔴"}
                          </span>

                          {user.is_active
                            ? "Active"
                            : "Suspended"}
                        </span>

                      </td>


                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(
                          user.created_at,
                        ).toLocaleDateString()}
                      </td>


                      <td className="px-5 py-4">

                        {isCurrentUser ? (
                          <div className="text-right">
                            <span className="text-xs text-gray-600">
                              Current account
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap justify-end gap-2">

                            <button
                              type="button"
                              disabled={
                                isUpdatingRole
                                || isUpdatingStatus
                              }
                              onClick={() =>
                                handleRoleChange(
                                  user.id,
                                  user.role,
                                )
                              }
                              className={`
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-medium
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                ${
                                  user.role
                                  === "admin"
                                    ? "border border-red-900 text-white-300 hover:bg-red-950"
                                    : "bg-blue-600 text-white hover:bg-blue-500"
                                }
                              `}
                            >
                              {isUpdatingRole
                                ? "Updating..."
                                : user.role
                                    === "admin"
                                  ? "Demote"
                                  : "Promote"}
                            </button>


                            <button
                              type="button"
                              disabled={
                                isUpdatingStatus
                                || isUpdatingRole
                              }
                              onClick={() =>
                                handleStatusChange(
                                  user.id,
                                  user.is_active,
                                )
                              }
                              className={`
                                rounded-lg
                                border
                                px-3
                                py-2
                                text-sm
                                font-medium
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                ${
                                  user.is_active
                                    ? "border-yellow-900 text-white-300 hover:bg-yellow-950"
                                    : "border-green-900 text-white-300 hover:bg-green-950"
                                }
                              `}
                            >
                              {isUpdatingStatus
                                ? "Updating..."
                                : user.is_active
                                  ? "Suspend"
                                  : "Activate"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPasswordResetUser({
                                    id: user.id,
                                    username: user.username,
                                    })
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
                                >
                                <KeyRound size={15} />

                                Reset Password
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget({
                                    id: user.id,
                                    username:
                                        user.username,
                                    email:
                                        user.email,
                                    })
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-white-300 transition hover:bg-red-950"
                                >
                                <Trash2 size={15} />

                                Delete
                            </button>

                            {passwordResetUser && (
                                <ResetPasswordModal
                                userId={
                                passwordResetUser.id
                                }
                                username={
                                passwordResetUser.username
                                }
                                onClose={() =>
                                setPasswordResetUser(
                                    null
                                )
                                }
                            />
                            )}

                            {deleteTarget && (
                                <DeleteUserModal
                                userId={
                                deleteTarget.id
                                }
                                username={
                                deleteTarget.username
                                }
                                email={
                                deleteTarget.email
                                }
                                onClose={() =>
                                setDeleteTarget(
                                    null
                                )
                                }
                            />
                            )}
                            

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                },
              )}

            </tbody>

          </table>

        </div>


        {filteredUsers.length
          === 0 && (
          <div className="px-6 py-16 text-center text-gray-500">
            No users match your search.
          </div>
        )}

      </div>

    </div>
  );
}