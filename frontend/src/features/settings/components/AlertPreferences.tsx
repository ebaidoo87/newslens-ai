import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Check,
  LoaderCircle,
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


interface AlertOption {
  value: string;
  title: string;
  description: string;
}


const ALERT_OPTIONS: AlertOption[] = [
  {
    value: "notifications_enabled",
    title: "Enable notifications",
    description:
      "Allow NewsLens to create alerts for matching articles.",
  },
  {
    value: "category_alerts",
    title: "Category alerts",
    description:
      "Notify me when articles match my favourite categories.",
  },
  {
    value: "country_alerts",
    title: "Country alerts",
    description:
      "Notify me when articles match my preferred countries.",
  },
  {
    value: "keyword_alerts",
    title: "Topic alerts",
    description:
      "Notify me when articles contain my saved topics or keywords.",
  },
];


export default function AlertPreferences() {
  const {
    preferences,
    selectedAlerts,
    isLoading,
    savePreferences,
  } = usePreferences();

  const {
    showToast,
  } = useToast();

  const [
    alerts,
    setAlerts,
  ] = useState<string[]>([]);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  useEffect(() => {
    setAlerts(selectedAlerts);
  }, [selectedAlerts]);


  function toggleAlert(
    value: string,
  ) {
    setAlerts(
      (currentAlerts) => {
        const isSelected =
          currentAlerts.includes(value);

        if (isSelected) {
          if (
            value
            === "notifications_enabled"
          ) {
            return [];
          }

          return currentAlerts.filter(
            (item) => item !== value,
          );
        }

        if (
          value
          !== "notifications_enabled"
          && !currentAlerts.includes(
            "notifications_enabled",
          )
        ) {
          return [
            "notifications_enabled",
            ...currentAlerts,
            value,
          ];
        }

        return [
          ...currentAlerts,
          value,
        ];
      },
    );
  }


  async function handleSave() {
    setIsSaving(true);

    const nonAlertPreferences =
      preferences.filter(
        (item) =>
          item.preference_type
          !== "alert",
      );

    const alertPreferences:
    UserPreferenceItem[] =
      alerts.map(
        (value) => ({
          preference_type: "alert",
          preference_value: value,
        }),
      );

    try {
      await savePreferences([
        ...nonAlertPreferences,
        ...alertPreferences,
      ]);

      showToast(
        "Notification preferences saved.",
        "success",
      );
    } catch {
      showToast(
        "Unable to save notification preferences.",
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

          Loading notification settings...
        </div>
      </section>
    );
  }


  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
      <div className="flex items-start gap-3">
        <Bell className="mt-1 text-blue-400" />

        <div>
          <h2 className="text-2xl font-bold">
            News alerts
          </h2>

          <p className="mt-2 text-gray-400">
            Choose which saved interests can
            generate notifications.
          </p>
        </div>
      </div>


      <div className="mt-6 space-y-3">
        {ALERT_OPTIONS.map(
          (option) => {
            const selected =
              alerts.includes(
                option.value,
              );

            const disabled =
              option.value
                !== "notifications_enabled"
              && !alerts.includes(
                "notifications_enabled",
              );

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  toggleAlert(
                    option.value,
                  )
                }
                disabled={disabled}
                aria-pressed={selected}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  px-4
                  py-4
                  text-left
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  ${
                    selected
                      ? "border-blue-500 bg-blue-950/50"
                      : "border-gray-700 bg-gray-800 hover:border-gray-500"
                  }
                `}
              >
                <div>
                  <p className="font-semibold text-gray-100">
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
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border
                    ${
                      selected
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-gray-600"
                    }
                  `}
                >
                  {selected && (
                    <Check size={15} />
                  )}
                </div>
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
          : "Save alert settings"}
      </button>
    </section>
  );
}