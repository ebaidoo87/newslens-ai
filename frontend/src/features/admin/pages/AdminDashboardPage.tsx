import {
  ShieldCheck,
} from "lucide-react";

import {
  useAuth,
} from "../../../shared/context/AuthContext";


export default function AdminDashboardPage() {
  const {
    user,
  } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-blue-400" />

        <div>
          <h1 className="text-4xl font-bold">
            Admin
          </h1>

          <p className="mt-2 text-gray-400">
            NewsLens administration and
            system monitoring.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-gray-400">
          Signed in as
        </p>

        <p className="mt-2 font-semibold text-white">
          {user?.email}
        </p>

        <p className="mt-1 text-sm text-blue-400">
          Administrator
        </p>
      </div>
    </div>
  );
}