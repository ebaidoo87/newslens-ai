import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import FeedStatusBadge from "./FeedStatusBadge";


describe(
  "FeedStatusBadge",
  () => {
    it(
      "renders nothing when the article has no activity",
      () => {
        const {
          container,
        } = render(
          <FeedStatusBadge
            isBookmarked={false}
            isViewed={false}
          />,
        );


        expect(
          container,
        ).toBeEmptyDOMElement();
      },
    );


    it(
      "shows Saved for bookmarked articles",
      () => {
        render(
          <FeedStatusBadge
            isBookmarked
            isViewed={false}
          />,
        );


        expect(
          screen.getByText(
            "Saved",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Viewed",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "shows Viewed for previously viewed articles",
      () => {
        render(
          <FeedStatusBadge
            isBookmarked={false}
            isViewed
          />,
        );


        expect(
          screen.getByText(
            "Viewed",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Saved",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "shows both activity signals when applicable",
      () => {
        render(
          <FeedStatusBadge
            isBookmarked
            isViewed
          />,
        );


        expect(
          screen.getByLabelText(
            "Article activity",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Saved",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Viewed",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);