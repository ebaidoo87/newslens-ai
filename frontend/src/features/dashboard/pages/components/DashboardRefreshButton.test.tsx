import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import DashboardRefreshButton from "./DashboardRefreshButton";


describe(
  "DashboardRefreshButton",
  () => {
    it(
      "renders the normal refresh state",
      () => {
        render(
          <DashboardRefreshButton
            isRefreshing={false}
            lastUpdated={null}
            onRefresh={
              vi.fn()
            }
          />,
        );


        const button =
          screen.getByRole(
            "button",
            {
              name:
                "Refresh feed",
            },
          );


        expect(
          button,
        ).toBeEnabled();
      },
    );


    it(
      "calls onRefresh when clicked",
      async () => {
        const user =
          userEvent.setup();

        const onRefresh =
          vi.fn().mockResolvedValue(
            undefined,
          );


        render(
          <DashboardRefreshButton
            isRefreshing={false}
            lastUpdated={null}
            onRefresh={
              onRefresh
            }
          />,
        );


        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Refresh feed",
            },
          ),
        );


        expect(
          onRefresh,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );


    it(
      "disables the button while refreshing",
      () => {
        render(
          <DashboardRefreshButton
            isRefreshing
            lastUpdated={null}
            onRefresh={
              vi.fn()
            }
          />,
        );


        const button =
          screen.getByRole(
            "button",
            {
              name:
                "Refreshing...",
            },
          );


        expect(
          button,
        ).toBeDisabled();
      },
    );


    it(
      "shows when the feed was last updated",
      () => {
        render(
          <DashboardRefreshButton
            isRefreshing={false}
            lastUpdated={
              new Date(
                "2026-08-28T20:30:00",
              )
            }
            onRefresh={
              vi.fn()
            }
          />,
        );


        expect(
          screen.getByText(
            /^Updated /,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "does not show update time when it has never refreshed",
      () => {
        render(
          <DashboardRefreshButton
            isRefreshing={false}
            lastUpdated={null}
            onRefresh={
              vi.fn()
            }
          />,
        );


        expect(
          screen.queryByText(
            /^Updated /,
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);