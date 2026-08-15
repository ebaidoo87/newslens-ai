import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCw,
  RotateCw,
  Send,
  XCircle,
} from "lucide-react";

import {
  useEmailStats,
  useRecentEmails,
} from "../hooks/useEmailMonitoring";


export default function EmailMonitoringPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isFetching: statsFetching,
  } = useEmailStats();

  const {
    data: emails,
    isLoading: emailsLoading,
    refetch: refetchEmails,
    isFetching: emailsFetching,
  } = useRecentEmails(25);


  function handleRefresh() {
    void refetchStats();
    void refetchEmails();
  }


  if (
    statsLoading
    || emailsLoading
  ) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading email delivery data...
      </div>
    );
  }


  const cards = [
    {
      title: "Total",
      value: stats?.total ?? 0,
      icon: Mail,
    },
    {
      title: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock3,
    },
    {
      title: "Delivered",
      value:
        stats?.delivered ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Sent",
      value: stats?.sent ?? 0,
      icon: Send,
    },
    {
      title: "Retrying",
      value:
        stats?.retrying ?? 0,
      icon: RotateCw,
    },
    {
      title: "Failed",
      value: stats?.failed ?? 0,
      icon: XCircle,
    },
    {
      title: "Bounced",
      value:
        stats?.bounced ?? 0,
      icon: AlertTriangle,
    },
    {
      title: "Suppressed",
      value:
        stats?.suppressed ?? 0,
      icon: Ban,
    },
  ];


  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Email Delivery
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor NewsLens email delivery,
            retries and provider status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={
            statsFetching
            || emailsFetching
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              statsFetching
              || emailsFetching
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(
          ({
            title,
            value,
            icon: Icon,
          }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {title}
                </span>

                <Icon
                  size={19}
                  className="text-gray-500"
                />
              </div>

              <p className="mt-3 text-3xl font-bold">
                {value}
              </p>
            </div>
          ),
        )}
      </div>


      <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="border-b border-gray-800 px-6 py-5">
          <h2 className="text-xl font-bold">
            Recent email activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest queued and delivered messages.
          </p>
        </div>


        {!emails?.length ? (
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
                    Queue
                  </th>

                  <th className="px-5 py-3">
                    Provider
                  </th>

                  <th className="px-5 py-3">
                    Retries
                  </th>

                  <th className="px-5 py-3">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {emails.map(
                  (email) => (
                    <tr
                      key={email.id}
                      className="border-b border-gray-800 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-200">
                            {email.recipient}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {email.subject}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 capitalize text-gray-300">
                        {email.email_type.replace(
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
                        <span className="text-gray-300">
                          {email.provider_status
                            ?? "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {email.retry_count}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {new Date(
                          email.created_at,
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

    </div>
  );
}