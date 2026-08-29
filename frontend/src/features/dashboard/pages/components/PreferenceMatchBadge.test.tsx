import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import type {
  Article,
} from "../../../news/types/article";

import PreferenceMatchBadge from "./PreferenceMatchBadge";


const article =
  {
    id: 1,

    title:
      "Artificial intelligence transforms journalism",

    summary:
      "AI tools are changing modern newsrooms.",

    content:
      "Artificial intelligence is increasingly used by publishers.",

    url:
      "https://example.com/article-1",

    source:
      "NewsLens",

    language:
      "en",

    country:
      "UK",

    category:
      "technology",

    published_at:
      null,
  } as Article;


describe(
  "PreferenceMatchBadge",
  () => {
    it(
      "renders when the category matches",
      () => {
        render(
          <PreferenceMatchBadge
            article={
              article
            }
            preferences={{
              categories: [
                "technology",
              ],

              countries: [],

              keywords: [],
            }}
          />,
        );


        expect(
          screen.getByText(
            "Matches your interests",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByLabelText(
            "This article matches your selected interests",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "renders when the country matches",
      () => {
        render(
          <PreferenceMatchBadge
            article={
              article
            }
            preferences={{
              categories: [],

              countries: [
                "UK",
              ],

              keywords: [],
            }}
          />,
        );


        expect(
          screen.getByText(
            "Matches your interests",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "renders when a keyword matches article content",
      () => {
        render(
          <PreferenceMatchBadge
            article={
              article
            }
            preferences={{
              categories: [],

              countries: [],

              keywords: [
                "artificial intelligence",
              ],
            }}
          />,
        );


        expect(
          screen.getByText(
            "Matches your interests",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "renders nothing when there are no preference matches",
      () => {
        const {
          container,
        } = render(
          <PreferenceMatchBadge
            article={
              article
            }
            preferences={{
              categories: [
                "sport",
              ],

              countries: [
                "Canada",
              ],

              keywords: [
                "football",
              ],
            }}
          />,
        );


        expect(
          container,
        ).toBeEmptyDOMElement();


        expect(
          screen.queryByText(
            "Matches your interests",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);