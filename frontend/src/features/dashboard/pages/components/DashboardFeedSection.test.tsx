import {
  describe,
  expect,
  it,
} from "vitest";

import {
  screen,
} from "@testing-library/react";

import {
  renderWithProviders,
} from "../../../../test/renderWithProviders";

import DashboardFeedSection from "./DashboardFeedSection";


describe(
  "DashboardFeedSection",
  () => {
    it(
      "renders its heading and children",
      () => {
        renderWithProviders(
          <DashboardFeedSection
            title="Recommended for you"
            description="Stories selected for your interests."
          >
            <div>
              Personalized article
            </div>
          </DashboardFeedSection>,
        );


        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Recommended for you",
            },
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Stories selected for your interests.",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Personalized article",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "renders a view-all link when configured",
      () => {
        renderWithProviders(
          <DashboardFeedSection
            title="Trending"
            viewAllTo="/trending"
            viewAllLabel="See trending"
          >
            <div>
              Trending article
            </div>
          </DashboardFeedSection>,
        );


        const link =
          screen.getByRole(
            "link",
            {
              name:
                "See trending",
            },
          );


        expect(
          link,
        ).toBeInTheDocument();


        expect(
          link,
        ).toHaveAttribute(
          "href",
          "/trending",
        );
      },
    );


    it(
      "renders an accessible loading state",
      () => {
        renderWithProviders(
          <DashboardFeedSection
            title="Discover"
            isLoading
          >
            <div>
              Hidden while loading
            </div>
          </DashboardFeedSection>,
        );


        expect(
          screen.getByText(
            "Loading Discover",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Hidden while loading",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "renders an alert when the section has an error",
      () => {
        renderWithProviders(
          <DashboardFeedSection
            title="Discover"
            error="Network Error"
          >
            <div>
              Hidden after failure
            </div>
          </DashboardFeedSection>,
        );


        expect(
          screen.getByRole(
            "alert",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Hidden after failure",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "renders configured empty-state content",
      () => {
        renderWithProviders(
          <DashboardFeedSection
            title="Recommended"
            isEmpty
            emptyTitle="You're caught up."
            emptyMessage="Check back when new stories arrive."
          >
            <div>
              Hidden empty content
            </div>
          </DashboardFeedSection>,
        );


        expect(
          screen.getByText(
            "You're caught up.",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Check back when new stories arrive.",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Hidden empty content",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);