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
      false,

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
            initialPath,

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


        expect(
          screen.getByText(
            "Home Page",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "restores the protected destination after successful login",
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


        renderLoginPage({
          state: {
            from: {
              pathname:
                "/saved",

              search:
                "?page=2",
            },
          },
        });


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
              screen.getByText(
                "Saved Page",
              ),
            ).toBeInTheDocument();
          },
        );
      },
    );


    it(
      "shows the invalid credentials message for a 401 response",
      async () => {
        const browserUser =
          userEvent.setup();

        const requestError =
          new Error(
            "Unauthorized",
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
                "Unauthorized",

                status:
                401,

                code:
                "UNAUTHORIZED",
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
          "wrong-password",
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
                "Invalid email or password. Please try again.",
            ),
            ).toBeInTheDocument();


            expect(
            mockNormalizeApiError,
            ).toHaveBeenCalledWith(
            requestError,
            );


            expect(
            screen.queryByText(
                "Home Page",
            ),
           ).not.toBeInTheDocument();
     
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
              screen.getByText(
                "Home Page",
              ),
            ).toBeInTheDocument();
          },
        );
      },
    );
  },
);