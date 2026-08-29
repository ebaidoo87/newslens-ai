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
} from "./renderWithProviders";


function SmokeComponent() {
  return (
    <div>
      NewsLens test environment
    </div>
  );
}


describe(
  "frontend test environment",
  () => {
    it(
      "renders React components",
      () => {
        renderWithProviders(
          <SmokeComponent />,
        );


        expect(
          screen.getByText(
            "NewsLens test environment",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);