import {
  Activity,
  Mail,
  Newspaper,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import {
  useAdminAnalytics,
} from "../hooks/useAdminAnalytics";


export default function AdminAnalyticsPanel() {
  const {
    data,
    isLoading,
  } = useAdminAnalytics();


  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-400">
        Loading analytics...
      </div>
    );
  }


  if (!data) {
    return null;
  }


  const cards = [
    {
      label: "Total Users",
      value: data.users.total,
      icon: Users,
    },

    {
      label: "Active Users",
      value: data.users.active,
      icon: UserCheck,
    },

    {
      label: "Suspended",
      value:
        data.users.suspended,
      icon: UserX,
    },

    {
      label: "Admins",
      value:
        data.users.admins,
      icon: ShieldCheck,
    },

    {
      label: "Articles",
      value:
        data.articles.total,
      icon: Newspaper,
    },

    {
      label: "Delivered Emails",
      value:
        data.emails.delivered,
      icon: Mail,
    },

    {
      label: "Audit Events (7d)",
      value:
        data.audit.events_7d,
      icon: Activity,
    },
  ];


  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-xl font-bold">
          Operational Analytics
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current NewsLens system activity.
        </p>
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
                  size={18}
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


      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <p className="text-sm text-gray-500">
            New users
          </p>

          <p className="mt-2 text-2xl font-bold">
            {data.users.new_7d}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Last 7 days
          </p>

        </div>


        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <p className="text-sm text-gray-500">
            New articles
          </p>

          <p className="mt-2 text-2xl font-bold">
            {data.articles.new_7d}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Last 7 days
          </p>

        </div>


        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <p className="text-sm text-gray-500">
            Failed emails
          </p>

          <p className="mt-2 text-2xl font-bold">
            {data.emails.failed}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Current total
          </p>

        </div>

      </div>

    </section>
  );
}