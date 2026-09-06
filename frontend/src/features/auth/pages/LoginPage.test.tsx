import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  normalizeApiError,
} from "../../../shared/api/errors";

import {
  useAuth,
} from "../../../shared/hooks/useAuth";

import LoginPage from "./LoginPage";


vi.mock(
  "../../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


vi.mock(
  "../../../shared/api/errors",
  () => ({
    normalizeApiError:
      vi.fn(),
  }),
);


const mockUseAuth =
  vi.mocked(
    useAuth,
  );

const mockNormalizeApiError =
  vi.mocked(
    normalizeApiError,
  );

let mockIsAuthenticated = false;


function createAuthState(
  overrides: Partial<
    ReturnType<
      typeof useAuth
    >
  > = {},
): ReturnType<
  typeof useAuth
> {
  return {
    user: null,
    token: null,

    isAuthenticated:
        mockIsAuthenticated,

    isLoading:
      false,

    isAdmin:
      false,

    login:
      vi.fn(),

    logout:
      vi.fn(),

    logoutAll:
      vi.fn(),

    refreshUser:
      vi.fn(),

    ...overrides,
  };
}


interface LoginRouteState {
  from?: {
    pathname?: string;
    search?: string;
  };

  registrationSuccess?: boolean;
  passwordChanged?: boolean;
}


function renderLoginPage(
  {
    initialPath = "/login",
    state,
  }: {
    initialPath?: string;
    state?: LoginRouteState;
  } = {},
) {
  return render(
    <MemoryRouter
      initialEntries={[
  {
    pathname:
      initialPath.split("?")[0],

    search:
      initialPath.includes("?")
        ? `?${initialPath.split("?")[1]}`
        : "",

    state,
  },
]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />

        <Route
          path="/"
          element={
            <div>
              Home Page
            </div>
          }
        />

        <Route
          path="/saved"
          element={
            <div>
              Saved Page
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div>
              Settings Page
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}


describe(
  "LoginPage",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      mockIsAuthenticated = false;

      mockNormalizeApiError
    .mockReturnValue({
        message:
        "Unable to sign in.",

        status:
        null,

        code:
        "UNKNOWN_ERROR",
    });
  },
);

    it(
      "shows the session restoration state while authentication is loading",
      () => {
        mockUseAuth
          .mockReturnValue(
            createAuthState({
              isLoading:
                true,
            }),
          );


        renderLoginPage();


        expect(
          screen.getByText(
            "Restoring your session...",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByRole(
            "heading",
            {
              name:
                "Welcome back",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
        "redirects an already authenticated user to home",
        () => {
            mockUseAuth
            .mockReturnValue(
                createAuthState({
                isAuthenticated:
                    true,
                }),
            );


            renderLoginPage();


            expect(
            screen.getByText(
                "Home Page",
            ),
            ).toBeInTheDocument();


            expect(
            screen.queryByRole(
                "heading",
                {
                name:
                    "Welcome back",
                },
            ),
            ).not.toBeInTheDocument();
        },
        );


        it(
        "submits the entered email and password",
        async () => {
            const browserUser =
            userEvent.setup();

            const login =
            vi.fn()
                .mockResolvedValue(
                undefined,
                );


            mockUseAuth
            .mockReturnValue(
                createAuthState({
                login,
                }),
            );


            renderLoginPage();


            await browserUser.type(
            screen.getByLabelText(
                "Email",
            ),
            "user@example.com",
            );

            await browserUser.type(
            screen.getByLabelText(
                "Password",
            ),
            "secret123",
            );

            await browserUser.click(
            screen.getByRole(
                "button",
                {
                name:
                    "Sign in",
                },
            ),
            );


            await waitFor(
            () => {
                expect(
                login,
                ).toHaveBeenCalledWith({
                email:
                    "user@example.com",

                password:
                    "secret123",
                });
            },
            );
        },
        );


        it(
        "restores the protected destination after authentication",
        () => {
            mockIsAuthenticated =
            true;

            mockUseAuth
            .mockReturnValue(
                createAuthState(),
            );


            renderLoginPage({
            initialPath:
                "/login?redirect=%2Fsaved",
            });


            expect(
            screen.getByText(
                "Saved Page",
            ),
            ).toBeInTheDocument();
        },
        );


    it(
      "shows a normalized API error for non-401 failures",
      async () => {
        const browserUser =
          userEvent.setup();

        const requestError =
          new Error(
            "Server failure",
          );

        const login =
          vi.fn()
            .mockRejectedValue(
              requestError,
            );


        mockUseAuth
          .mockReturnValue(
            createAuthState({
              login,
            }),
          );

        mockNormalizeApiError
            .mockReturnValue({
                message:
                "Authentication service is temporarily unavailable.",

                status:
                503,

                code:
                "SERVICE_UNAVAILABLE",
        });


        renderLoginPage();


        await browserUser.type(
          screen.getByLabelText(
            "Email",
          ),
          "user@example.com",
        );

        await browserUser.type(
          screen.getByLabelText(
            "Password",
          ),
          "secret123",
        );

        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sign in",
            },
          ),
        );


        expect(
          await screen.findByText(
            "Authentication service is temporarily unavailable.",
          ),
        ).toBeInTheDocument();


        expect(
          mockNormalizeApiError,
        ).toHaveBeenCalledWith(
          requestError,
        );
      },
    );


    it(
      "shows registration and password-change success messages from route state",
      () => {
        mockUseAuth
          .mockReturnValue(
            createAuthState(),
          );


        renderLoginPage({
          state: {
            registrationSuccess:
              true,

            passwordChanged:
              true,
          },
        });


        expect(
          screen.getByText(
            "Your account was created successfully. You can now sign in.",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Your password was changed successfully\./,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "disables the submit button while login is in progress",
      async () => {
        const browserUser =
          userEvent.setup();


        let resolveLogin:
          (() => void)
          | undefined;


        const loginPromise =
          new Promise<void>(
            (resolve) => {
              resolveLogin =
                resolve;
            },
          );


        const login =
          vi.fn()
            .mockReturnValue(
              loginPromise,
            );


        mockUseAuth
          .mockReturnValue(
            createAuthState({
              login,
            }),
          );


        renderLoginPage();


        await browserUser.type(
          screen.getByLabelText(
            "Email",
          ),
          "user@example.com",
        );

        await browserUser.type(
          screen.getByLabelText(
            "Password",
          ),
          "secret123",
        );


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sign in",
            },
          ),
        );


        const submittingButton =
          screen.getByRole(
            "button",
            {
              name:
                "Signing in...",
            },
          );


        expect(
          submittingButton,
        ).toBeDisabled();


        resolveLogin?.();


        await waitFor(
        () => {
            expect(
            screen.getByRole(
                "button",
                {
                name:
                    "Sign in",
                },
            ),
            ).not.toBeDisabled();
        },
        );
      },
    );

    it(
  "falls back to the dashboard for an unsafe redirect destination",
  () => {
    mockIsAuthenticated = true;

    mockUseAuth
      .mockReturnValue(
        createAuthState(),
      );


    renderLoginPage({
      initialPath:
        "/login?redirect=%2F%2Fevil.example.com",
    });


    expect(
      screen.getByText(
        "Home Page",
      ),
    ).toBeInTheDocument();
  },
);
it(
  "redirects an authenticated user to the requested recommended page",
  () => {
    mockIsAuthenticated = true;

    mockUseAuth
      .mockReturnValue(
        createAuthState(),
      );


    render(
      <MemoryRouter
        initialEntries={[
          "/login?redirect=%2Frecommended",
        ]}
      >
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/recommended"
            element={
              <div>
                Recommended Page
              </div>
            }
          />
        </Routes>
      </MemoryRouter>,
    );


    expect(
      screen.getByText(
        "Recommended Page",
      ),
    ).toBeInTheDocument();
  },
);
  },
);