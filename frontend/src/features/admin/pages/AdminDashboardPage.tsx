import {
  Activity,
  Bell,
  Database,
  Mail,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useAdminDashboard,
  useAdminRecentEmails,
  useAdminSystemHealth,
  useAdminUserStats,
} from "../hooks/useAdminDashboard";

import RecentAuditActivity
from "../components/RecentAuditActivity";

export default function AdminDashboardPage() {
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    refetch: refetchDashboard,
  } = useAdminDashboard();

  const {
    data: userStats,
    isLoading: userStatsLoading,
    isFetching: userStatsFetching,
    refetch: refetchUserStats,
  } = useAdminUserStats();

  const {
    data: systemHealth,
    isLoading: healthLoading,
    isFetching: healthFetching,
    refetch: refetchHealth,
  } = useAdminSystemHealth();

  const {
    data: recentEmails,
    isLoading: emailsLoading,
    isFetching: emailsFetching,
    refetch: refetchEmails,
  } = useAdminRecentEmails(10);


  const isLoading =
    dashboardLoading
    || userStatsLoading
    || healthLoading
    || emailsLoading;


  const isRefreshing =
    dashboardFetching
    || userStatsFetching
    || healthFetching
    || emailsFetching;


  function handleRefresh() {
    void refetchDashboard();
    void refetchUserStats();
    void refetchHealth();
    void refetchEmails();
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
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }


  const emailStats =
    dashboard?.email;


  const cards = [
    {
      label: "Users",
      value: dashboard?.users ?? 0,
      icon: Users,
    },
    {
      label: "Articles",
      value: dashboard?.articles ?? 0,
      icon: Newspaper,
    },
    {
      label: "Notifications",
      value:
        dashboard?.notifications ?? 0,
      icon: Bell,
    },
    {
      label: "Emails Sent",
      value:
        emailStats?.sent ?? 0,
      icon: Mail,
    },
  ];


  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-400" />

            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          <p className="mt-2 text-gray-400">
            Monitor NewsLens users,
            content, email delivery
            and system health.
          </p>
        </div>


        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isRefreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {label}
                </span>

                <Icon
                  size={20}
                  className="text-gray-500"
                />
              </div>

              <p className="mt-3 text-3xl font-bold text-white">
                {value}
              </p>
            </div>
          ),
        )}
      </div>


      <div className="grid gap-6 lg:grid-cols-2">

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-3">
            <Database className="text-green-400" />

            <div>
              <h2 className="text-xl font-bold">
                System Health
              </h2>

              <p className="text-sm text-gray-500">
                Current backend status
              </p>
            </div>
          </div>


          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between rounded-xl bg-gray-800 p-4">
              <span className="text-gray-300">
                Application
              </span>

              <span
                className={
                  systemHealth?.status
                  === "healthy"
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {systemHealth?.status
                  ?? "unknown"}
              </span>
            </div>


            <div className="flex items-center justify-between rounded-xl bg-gray-800 p-4">
              <span className="text-gray-300">
                Database
              </span>

              <span
                className={
                  systemHealth?.database
                  === "connected"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {systemHealth?.database
                  ?? "unknown"}
              </span>
            </div>

          </div>
        </section>


        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <div className="flex items-center gap-3">
            <Users className="text-blue-400" />

            <div>
              <h2 className="text-xl font-bold">
                User Roles
              </h2>

              <p className="text-sm text-gray-500">
                Current account distribution
              </p>
            </div>
          </div>


          <div className="mt-6 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-gray-800 p-4 text-center">
              <p className="text-2xl font-bold">
                {userStats?.total ?? 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Total
              </p>
            </div>


            <div className="rounded-xl bg-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {userStats?.admins ?? 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Admins
              </p>
            </div>


            <div className="rounded-xl bg-gray-800 p-4 text-center">
              <p className="text-2xl font-bold">
                {userStats?.users ?? 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Users
              </p>
            </div>

          </div>
        </section>

      </div>


      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

        <div className="flex items-center gap-3">
          <Activity className="text-purple-400" />

          <div>
            <h2 className="text-xl font-bold">
              Email Delivery
            </h2>

            <p className="text-sm text-gray-500">
              NewsLens email pipeline
            </p>
          </div>
        </div>


        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl bg-gray-800 p-4">
            <p className="text-sm text-gray-500">
              Sent
            </p>

            <p className="mt-2 text-2xl font-bold">
              {emailStats?.sent ?? 0}
            </p>
          </div>


          <div className="rounded-xl bg-gray-800 p-4">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              {emailStats?.delivered ?? 0}
            </p>
          </div>


          <div className="rounded-xl bg-gray-800 p-4">
            <p className="text-sm text-gray-500">
              Failed
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {emailStats?.failed ?? 0}
            </p>
          </div>


          <div className="rounded-xl bg-gray-800 p-4">
            <p className="text-sm text-gray-500">
              Suppressed
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {emailStats?.suppressed ?? 0}
            </p>
          </div>

        </div>
      </section>


      <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

        <div className="border-b border-gray-800 px-6 py-5">
          <h2 className="text-xl font-bold">
            Recent Email Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest NewsLens email queue activity.
          </p>
        </div>


        {!recentEmails?.length ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No email activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="border-b border-gray-800 bg-gray-950/50 text-gray-400">
                <tr>
                  <th className="px-5 py-3">
                    Recipient
                  </th>

                  <th className="px-5 py-3">
                    Type
                  </th>

                  <th className="px-5 py-3">
                    Queue Status
                  </th>

                  <th className="px-5 py-3">
                    Provider
                  </th>

                  <th className="px-5 py-3">
                    Retries
                  </th>
                </tr>
              </thead>


              <tbody>
                {recentEmails.map(
                  (email) => (
                    <tr
                      key={email.id}
                      className="border-b border-gray-800 last:border-b-0"
                    >

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-200">
                          {email.recipient}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {email.subject}
                        </p>
                      </td>


                      <td className="px-5 py-4 capitalize text-gray-300">
                        {email.email_type.replaceAll(
                          "_",
                          " ",
                        )}
                      </td>


                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs capitalize">
                          {email.status}
                        </span>
                      </td>


                      <td className="px-5 py-4">
                        {email.provider_status
                          ?? email.provider
                          ?? "—"}
                      </td>


                      <td className="px-5 py-4 text-gray-400">
                        {email.retry_count}
                      </td>

                    </tr>
                  ),
                )}
              </tbody>

            </table>
          </div>
        )}
        <RecentAuditActivity />

      </section>

    </div>
  );
}