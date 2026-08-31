import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  describe,
  expect,
  it,
} from "vitest";

import ArticleImage from "./ArticleImage";


interface RenderArticleImageProps {
  src?: string | null;
  alt?: string;
  articleId?: number;
  className?: string;
}


function renderArticleImage(
  props: RenderArticleImageProps = {},
) {
  return render(
    <MemoryRouter>
      <ArticleImage
        src="https://example.com/news.jpg"
        alt="Test article"
        {...props}
      />
    </MemoryRouter>,
  );
}


describe("ArticleImage", () => {
  it("renders a valid image", () => {
    renderArticleImage();

    expect(
      screen.getByRole("img", {
        name: "Test article",
      }),
    ).toBeInTheDocument();
  });


  it("uses lazy loading and async decoding", () => {
    renderArticleImage();

    const image =
      screen.getByRole("img", {
        name: "Test article",
      });

    expect(image).toHaveAttribute(
      "loading",
      "lazy",
    );

    expect(image).toHaveAttribute(
      "decoding",
      "async",
    );
  });


  it("shows the fallback when src is missing", () => {
    renderArticleImage({
      src: null,
    });

    expect(
      screen.getByRole("img", {
        name: "Test article image unavailable",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Image unavailable",
      ),
    ).toBeInTheDocument();
  });


  it("shows the fallback when image loading fails", () => {
    renderArticleImage();

    const image =
      screen.getByRole("img", {
        name: "Test article",
      });

    fireEvent.error(image);

    expect(
      screen.getByRole("img", {
        name: "Test article image unavailable",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Image unavailable",
      ),
    ).toBeInTheDocument();
  });


  it("wraps the image in an article link when articleId is provided", () => {
    renderArticleImage({
      articleId: 42,
    });

    const link =
      screen.getByRole("link", {
        name: "View Test article",
      });

    expect(link).toHaveAttribute(
      "href",
      "/articles/42",
    );
  });


  it("does not render an article link without articleId", () => {
    renderArticleImage();

    expect(
      screen.queryByRole("link"),
    ).not.toBeInTheDocument();
  });


  it("supports custom image dimensions", () => {
    renderArticleImage({
      className: "h-20 w-24",
    });

    expect(
      screen.getByRole("img", {
        name: "Test article",
      }),
    ).toHaveClass(
      "h-20",
      "w-24",
    );
  });
});