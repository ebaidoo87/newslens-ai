import type {
  ReactNode,
} from "react";

import {
  act,
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
  AUTH_SESSION_EXPIRED_EVENT,
  TOKEN_STORAGE_KEY,
} from "../api/interceptors";

import {
  getCurrentUser,
  loginUser,
  logoutAllDevices,
} from "../services/authApi";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  AuthProvider,
} from "./AuthProvider";


vi.mock(
  "../services/authApi",
  () => ({
    getCurrentUser: vi.fn(),
    loginUser: vi.fn(),
    logoutAllDevices: vi.fn(),
  }),
);


const mockGetCurrentUser =
  vi.mocked(
    getCurrentUser,
  );

const mockLoginUser =
  vi.mocked(
    loginUser,
  );

const mockLogoutAllDevices =
  vi.mocked(
    logoutAllDevices,
  );


const user = {
  id: 1,
  email: "user@example.com",
  username: "testuser",
  role: "user" as const,
};


function TestConsumer({
  children,
}: {
  children?: ReactNode;
}) {
  const auth =
    useAuth();

  return (
    <div>
      <span data-testid="loading">
        {String(
          auth.isLoading,
        )}
      </span>

      <span data-testid="authenticated">
        {String(
          auth.isAuthenticated,
        )}
      </span>

      <span data-testid="admin">
        {String(
          auth.isAdmin,
        )}
      </span>

      <span data-testid="token">
        {auth.token ?? "none"}
      </span>

      <span data-testid="user">
        {auth.user?.email ?? "none"}
      </span>

      <button
        type="button"
        onClick={() => {
          void auth.login({
            email:
              "user@example.com",

            password:
              "secret123",
          });
        }}
      >
        Login
      </button>

      <button
        type="button"
        onClick={
          auth.logout
        }
      >
        Logout
      </button>

      <button
        type="button"
        onClick={() => {
            void auth
            .logoutAll()
            .catch(
                () => undefined,
            );
        }}
        >
        Logout all
        </button>

      {children}
    </div>
  );
}


function renderProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}


describe(
  "AuthProvider",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      localStorage.clear();

      mockLogoutAllDevices
        .mockResolvedValue(
          undefined,
        );
    });


    it(
      "starts unauthenticated when no stored token exists",
      async () => {
        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "loading",
              ),
            ).toHaveTextContent(
              "false",
            );
          },
        );


        expect(
          screen.getByTestId(
            "authenticated",
          ),
        ).toHaveTextContent(
          "false",
        );


        expect(
          screen.getByTestId(
            "token",
          ),
        ).toHaveTextContent(
          "none",
        );


        expect(
          mockGetCurrentUser,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "restores a valid stored session",
      async () => {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "stored-token",
        );

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        expect(
          screen.getByTestId(
            "user",
          ),
        ).toHaveTextContent(
          "user@example.com",
        );


        expect(
          screen.getByTestId(
            "token",
          ),
        ).toHaveTextContent(
          "stored-token",
        );
      },
    );


    it(
      "clears an invalid stored session",
      async () => {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "expired-token",
        );

        mockGetCurrentUser
          .mockRejectedValue(
            new Error(
              "Unauthorized",
            ),
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "loading",
              ),
            ).toHaveTextContent(
              "false",
            );
          },
        );


        expect(
          screen.getByTestId(
            "authenticated",
          ),
        ).toHaveTextContent(
          "false",
        );


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );


    it(
      "logs in and stores the returned access token",
      async () => {
        const browserUser =
          userEvent.setup();


        mockLoginUser
          .mockResolvedValue({
            access_token:
              "new-access-token",

            token_type:
              "bearer",
          });

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "loading",
              ),
            ).toHaveTextContent(
              "false",
            );
          },
        );


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Login",
            },
          ),
        );


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        expect(
          mockLoginUser,
        ).toHaveBeenCalledWith({
          email:
            "user@example.com",

          password:
            "secret123",
        });


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBe(
          "new-access-token",
        );


        expect(
          screen.getByTestId(
            "user",
          ),
        ).toHaveTextContent(
          "user@example.com",
        );
      },
    );


    it(
      "clears the local session on logout",
      async () => {
        const browserUser =
          userEvent.setup();


        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "stored-token",
        );

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Logout",
            },
          ),
        );


        expect(
          screen.getByTestId(
            "authenticated",
          ),
        ).toHaveTextContent(
          "false",
        );


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );


    it(
      "logs out all devices and clears the local session",
      async () => {
        const browserUser =
          userEvent.setup();


        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "stored-token",
        );

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Logout all",
            },
          ),
        );


        await waitFor(
          () => {
            expect(
              mockLogoutAllDevices,
            ).toHaveBeenCalledTimes(
              1,
            );
          },
        );


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "false",
            );
          },
        );


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );


    it(
      "clears the session even if logout-all fails",
      async () => {
        const browserUser =
          userEvent.setup();


        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "stored-token",
        );

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );

        mockLogoutAllDevices
          .mockRejectedValue(
            new Error(
              "Network failure",
            ),
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Logout all",
            },
          ),
        );


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "false",
            );
          },
        );


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );


    it(
      "clears the session when the global session-expired event fires",
      async () => {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          "stored-token",
        );

        mockGetCurrentUser
          .mockResolvedValue(
            user,
          );


        renderProvider();


        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "authenticated",
              ),
            ).toHaveTextContent(
              "true",
            );
          },
        );


        act(
          () => {
            window.dispatchEvent(
              new Event(
                AUTH_SESSION_EXPIRED_EVENT,
              ),
            );
          },
        );


        expect(
          screen.getByTestId(
            "authenticated",
          ),
        ).toHaveTextContent(
          "false",
        );


        expect(
          localStorage.getItem(
            TOKEN_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );
  },
);