import {
  ShieldCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useRecentAuditLogs,
} from "../hooks/useAuditLogs";


function badgeColor(
  action: string,
) {
  switch (action) {
    case "promote_user":
      return "bg-green-900 text-white-300";

    case "demote_user":
      return "bg-yellow-900 text-white-300";

    case "suspend_user":
      return "bg-red-900 text-white-300";

    case "activate_user":
      return "bg-blue-900 text-blue-300";

    case "reset_password":
      return "bg-purple-900 text-purple-300";

    case "delete_user":
      return "bg-red-950 text-red-200";

    default:
      return "bg-gray-800 text-gray-300";
  }
}


export default function RecentAuditActivity() {
  const {
    data: logs = [],
    isLoading,
    isError,
  } = useRecentAuditLogs(8);


  return (
    <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

      <div className="border-b border-gray-800 px-6 py-5">

        <div className="flex items-center gap-3">

          <ShieldCheck
            size={20}
            className="text-blue-400"
          />

          <div>
            <h2 className="text-xl font-bold">
              Recent Administrative Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest sensitive admin actions.
            </p>
          </div>

        </div>

      </div>


      {isLoading ? (

        <div className="p-8 text-center text-gray-400">
          Loading recent activity...
        </div>

      ) : isError ? (

        <div className="p-8 text-center text-red-400">
          Unable to load administrative activity.
        </div>

      ) : !logs.length ? (

        <div className="p-8 text-center text-gray-500">
          No administrative activity yet.
        </div>

      ) : (

        <div className="divide-y divide-gray-800">

          {logs.map(
            (log) => (

              <div
                key={log.id}
                className="px-6 py-4"
              >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="min-w-0">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        capitalize
                        ${badgeColor(
                          log.action,
                        )}
                      `}
                    >
                      {log.action.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>


                    <p className="mt-2 text-sm text-gray-400">
                      {log.details
                        ?? "No details"}
                    </p>


                    <p className="mt-1 text-xs text-gray-600">
                      Admin{" "}
                      {log.admin_user_id
                        ? `#${log.admin_user_id}`
                        : "—"}

                      {" · "}

                      Target{" "}
                      {log.target_user_id
                        ? `#${log.target_user_id}`
                        : "—"}
                    </p>

                  </div>


                  <span className="shrink-0 text-xs text-gray-500">
                    {new Date(
                      log.created_at,
                    ).toLocaleString()}
                  </span>

                </div>

              </div>

            ),
          )}

        </div>

      )}


      <div className="border-t border-gray-800 p-4">

        <Link
          to="/admin/audit"
          className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          View Audit Logs →
        </Link>

      </div>

    </section>
  );
}