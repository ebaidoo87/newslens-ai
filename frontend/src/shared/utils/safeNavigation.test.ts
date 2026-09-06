import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getSafeExternalUrl,
  getSafeInternalPath,
} from "./safeNavigation";


describe(
  "getSafeExternalUrl",
  () => {
    it(
      "accepts HTTPS URLs",
      () => {
        expect(
          getSafeExternalUrl(
            "https://example.com/article",
          ),
        ).toBe(
          "https://example.com/article",
        );
      },
    );


    it(
      "accepts HTTP URLs",
      () => {
        expect(
          getSafeExternalUrl(
            "http://example.com/article",
          ),
        ).toBe(
          "http://example.com/article",
        );
      },
    );


    it.each([
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
      "ftp://example.com/file",
    ])(
      "rejects unsafe URL %s",
      (value) => {
        expect(
          getSafeExternalUrl(
            value,
          ),
        ).toBeNull();
      },
    );


    it(
      "rejects malformed URLs",
      () => {
        expect(
          getSafeExternalUrl(
            "not a url",
          ),
        ).toBeNull();
      },
    );


    it(
      "rejects empty values",
      () => {
        expect(
          getSafeExternalUrl(
            "",
          ),
        ).toBeNull();
      },
    );
  },
);


describe(
  "getSafeInternalPath",
  () => {
    it(
      "accepts application paths",
      () => {
        expect(
          getSafeInternalPath(
            "/recommended",
          ),
        ).toBe(
          "/recommended",
        );
      },
    );


    it(
      "accepts paths with query strings",
      () => {
        expect(
          getSafeInternalPath(
            "/search?q=ai",
          ),
        ).toBe(
          "/search?q=ai",
        );
      },
    );


    it.each([
      "https://evil.example.com",
      "javascript:alert(1)",
      "//evil.example.com",
      "\\\\evil.example.com",
      "",
    ])(
      "rejects unsafe redirect %s",
      (value) => {
        expect(
          getSafeInternalPath(
            value,
          ),
        ).toBe("/");
      },
    );


    it(
      "supports a custom fallback",
      () => {
        expect(
          getSafeInternalPath(
            "https://evil.example.com",
            "/news",
          ),
        ).toBe(
          "/news",
        );
      },
    );
  },
);