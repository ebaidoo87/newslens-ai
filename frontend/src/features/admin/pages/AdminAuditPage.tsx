import {
  Activity,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useAuditLogs,
  useAuditStats,
} from "../hooks/useAuditLogs";


export default function AdminAuditPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    actionFilter,
    setActionFilter,
  ] = useState("");

  const [
    adminId,
    setAdminId,
  ] = useState("");

  const [
    targetId,
    setTargetId,
  ] = useState("");

  const [
    dateFrom,
    setDateFrom,
  ] = useState("");

  const [
    dateTo,
    setDateTo,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(0);

  const limit = 25;

  const skip =
    page * limit;


  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useAuditLogs({
    skip,
    limit,

    search:
      search.trim()
        || undefined,

    action:
      actionFilter
        || undefined,

    admin_user_id:
      adminId
        ? Number(adminId)
        : undefined,

    target_user_id:
      targetId
        ? Number(targetId)
        : undefined,

    date_from:
      dateFrom
        ? `${dateFrom}T00:00:00`
        : undefined,

    date_to:
      dateTo
        ? `${dateTo}T23:59:59`
        : undefined,
  });


  const {
    data: stats,
    refetch: refetchStats,
  } = useAuditStats();


  const logs =
    data?.items ?? [];

  const total =
    data?.total ?? 0;

  const hasNextPage =
    skip + limit < total;


  function handleRefresh() {
    void refetch();
    void refetchStats();
  }


  function handleClearFilters() {
    setSearch("");
    setActionFilter("");
    setAdminId("");
    setTargetId("");
    setDateFrom("");
    setDateTo("");
    setPage(0);
  }


  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-blue-400"
          />

          <p className="mt-4 text-gray-400">
            Loading audit logs...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <ShieldCheck
              className="text-blue-400"
            />

            <h1 className="text-4xl font-bold">
              Audit Logs
            </h1>

          </div>

          <p className="mt-2 text-gray-400">
            Review sensitive administrative
            actions performed in NewsLens.
          </p>
        </div>


        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-400">
              Total audit events
            </span>

            <Activity
              size={19}
              className="text-gray-500"
            />

          </div>

          <p className="mt-3 text-3xl font-bold">
            {stats?.total ?? 0}
          </p>

        </div>

      </div>


      {/* Filters */}
      <div className="space-y-3">

        <div className="grid gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4 md:grid-cols-2 xl:grid-cols-3">

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );

              setPage(0);
            }}
            placeholder="Search audit logs..."
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />


          <select
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(
                event.target.value
              );

              setPage(0);
            }}
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">
              All actions
            </option>

            <option value="promote_user">
              Promote User
            </option>

            <option value="demote_user">
              Demote User
            </option>

            <option value="suspend_user">
              Suspend User
            </option>

            <option value="activate_user">
              Activate User
            </option>

            <option value="reset_password">
              Reset Password
            </option>

            <option value="delete_user">
              Delete User
            </option>
          </select>


          <input
            type="number"
            min="1"
            value={adminId}
            onChange={(event) => {
              setAdminId(
                event.target.value
              );

              setPage(0);
            }}
            placeholder="Admin ID"
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />


          <input
            type="number"
            min="1"
            value={targetId}
            onChange={(event) => {
              setTargetId(
                event.target.value
              );

              setPage(0);
            }}
            placeholder="Target user ID"
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />


          <input
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(
                event.target.value
              );

              setPage(0);
            }}
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />


          <input
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(
                event.target.value
              );

              setPage(0);
            }}
            className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

        </div>


        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
        >
          Clear filters
        </button>

      </div>


      {/* Audit Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

        <div className="border-b border-gray-800 px-6 py-5">

          <h2 className="text-xl font-bold">
            Administrative Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest recorded admin actions.
          </p>

        </div>


        {!logs.length ? (

          <div className="px-6 py-16 text-center text-gray-500">
            No audit events found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/50 text-gray-400">

                <tr>

                  <th className="px-5 py-3">
                    Action
                  </th>

                  <th className="px-5 py-3">
                    Admin
                  </th>

                  <th className="px-5 py-3">
                    Target
                  </th>

                  <th className="px-5 py-3">
                    Details
                  </th>

                  <th className="px-5 py-3">
                    Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {logs.map(
                  (log) => (

                    <tr
                      key={log.id}
                      className="border-b border-gray-800 last:border-b-0"
                    >

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-blue-950 px-2.5 py-1 text-xs font-semibold text-blue-300">
                          {log.action.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>

                      </td>


                      <td className="px-5 py-4 text-gray-300">
                        {log.admin_user_id
                          ? `#${log.admin_user_id}`
                          : "—"}
                      </td>


                      <td className="px-5 py-4 text-gray-300">
                        {log.target_user_id
                          ? `#${log.target_user_id}`
                          : "—"}
                      </td>


                      <td className="max-w-md px-5 py-4 text-gray-400">
                        {log.details
                          ?? "—"}
                      </td>


                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {new Date(
                          log.created_at,
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ),
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* Pagination */}
      <div className="flex items-center justify-between">

        <button
          type="button"
          disabled={page === 0}
          onClick={() =>
            setPage(
              (current) =>
                Math.max(
                  current - 1,
                  0,
                ),
            )
          }
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>


        <span className="text-sm text-gray-500">
          Page {page + 1}
          {" · "}
          {total} results
        </span>


        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() =>
            setPage(
              (current) =>
                current + 1,
            )
          }
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
}