import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  LoaderCircle,
  Mail,
} from "lucide-react";

import {
  usePreferences,
} from "../../../shared/context/PreferenceContext";

import {
  useToast,
} from "../../../shared/context/ToastContext";

import type {
  UserPreferenceItem,
} from "../../../shared/services/preferenceApi";


const EMAIL_ENABLED =
  "email_enabled";

const EMAIL_INSTANT =
  "email_instant";

const EMAIL_DAILY =
  "email_daily_digest";

const EMAIL_WEEKLY =
  "email_weekly_digest";


interface EmailOption {
  value: string;
  title: string;
  description: string;
}


const DELIVERY_OPTIONS:
EmailOption[] = [
  {
    value: EMAIL_INSTANT,
    title: "Instant alerts",
    description:
      "Email me shortly after a new article matches my alert preferences.",
  },
  {
    value: EMAIL_DAILY,
    title: "Daily digest",
    description:
      "Send one summary of matching articles each day.",
  },
  {
    value: EMAIL_WEEKLY,
    title: "Weekly digest",
    description:
      "Send one summary of matching articles each week.",
  },
];


export default function EmailAlertPreferences() {
  const {
    preferences,
    selectedEmailAlerts,
    isLoading,
    savePreferences,
  } = usePreferences();

  const {
    showToast,
  } = useToast();

  const [
    emailAlerts,
    setEmailAlerts,
  ] = useState<string[]>([]);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  useEffect(() => {
    setEmailAlerts(
      selectedEmailAlerts,
    );
  }, [selectedEmailAlerts]);


  const emailEnabled =
    emailAlerts.includes(
      EMAIL_ENABLED,
    );


  function toggleEmailEnabled() {
    setEmailAlerts(
      (current) => {
        if (
          current.includes(
            EMAIL_ENABLED,
          )
        ) {
          return [];
        }

        return [
          EMAIL_ENABLED,
          EMAIL_DAILY,
        ];
      },
    );
  }


  function selectDeliveryMode(
    value: string,
  ) {
    if (!emailEnabled) {
      return;
    }

    setEmailAlerts([
      EMAIL_ENABLED,
      value,
    ]);
  }


  async function handleSave() {
    setIsSaving(true);

    const nonEmailPreferences =
      preferences.filter(
        (item) =>
          item.preference_type
          !== "email_alert",
      );

    const emailPreferences:
    UserPreferenceItem[] =
      emailAlerts.map(
        (value) => ({
          preference_type:
            "email_alert",
          preference_value:
            value,
        }),
      );

    try {
      await savePreferences([
        ...nonEmailPreferences,
        ...emailPreferences,
      ]);

      showToast(
        "Email notification settings saved.",
        "success",
      );
    } catch {
      showToast(
        "Unable to save email settings.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }


  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-center gap-3 text-gray-400">
          <LoaderCircle
            size={20}
            className="animate-spin"
          />

          Loading email settings...
        </div>
      </section>
    );
  }


  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">

      <div className="flex items-start gap-3">
        <Mail className="mt-1 text-blue-400" />

        <div>
          <h2 className="text-2xl font-bold">
            Email alerts
          </h2>

          <p className="mt-2 text-gray-400">
            Choose whether NewsLens should
            send matching news alerts to
            your account email address.
          </p>
        </div>
      </div>


      <button
        type="button"
        onClick={toggleEmailEnabled}
        aria-pressed={emailEnabled}
        className={`
          mt-6
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          border
          px-4
          py-4
          text-left
          transition
          ${
            emailEnabled
              ? "border-blue-500 bg-blue-950/50"
              : "border-gray-700 bg-gray-800 hover:border-gray-500"
          }
        `}
      >
        <div>
          <p className="font-semibold">
            Enable email notifications
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Allow NewsLens to send news
            alerts by email.
          </p>
        </div>

        <div
          className={`
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            border
            ${
              emailEnabled
                ? "border-blue-500 bg-blue-600"
                : "border-gray-600"
            }
          `}
        >
          {emailEnabled && (
            <Check size={15} />
          )}
        </div>
      </button>


      <div className="mt-6">
        <h3 className="font-semibold">
          Delivery frequency
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Choose how often you want
          matching stories delivered.
        </p>
      </div>


      <div className="mt-4 space-y-3">
        {DELIVERY_OPTIONS.map(
          (option) => {
            const selected =
              emailAlerts.includes(
                option.value,
              );

            return (
              <button
                key={option.value}
                type="button"
                disabled={!emailEnabled}
                onClick={() =>
                  selectDeliveryMode(
                    option.value,
                  )
                }
                aria-pressed={selected}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  px-4
                  py-4
                  text-left
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  ${
                    selected
                      ? "border-blue-500 bg-blue-950/40"
                      : "border-gray-700 bg-gray-800 hover:border-gray-500"
                  }
                `}
              >
                <div>
                  <p className="font-medium">
                    {option.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {
                      option.description
                    }
                  </p>
                </div>

                <div
                  className={`
                    h-5
                    w-5
                    rounded-full
                    border-2
                    ${
                      selected
                        ? "border-blue-400 bg-blue-500"
                        : "border-gray-600"
                    }
                  `}
                />
              </button>
            );
          },
        )}
      </div>


      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving && (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        )}

        {isSaving
          ? "Saving..."
          : "Save email settings"}
      </button>

    </section>
  );
}