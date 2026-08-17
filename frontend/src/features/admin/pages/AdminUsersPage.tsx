import {
  Users,
} from "lucide-react";

import {
  useUsers,
} from "../hooks/useUsers";

export default function AdminUsersPage() {

  const {
    data,
    isLoading,
  } = useUsers();

  if (isLoading) {
    return (
      <p>
        Loading...
      </p>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3">

        <Users />

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800">

        <table className="w-full">

          <thead>

            <tr>

              <th>ID</th>

              <th>User</th>

              <th>Email</th>

              <th>Role</th>

            </tr>

          </thead>

          <tbody>

            {data?.map(
              (user) => (
                <tr
                  key={user.id}
                >

                  <td>
                    {user.id}
                  </td>

                  <td>
                    {user.username}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

                </tr>
              ),
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}