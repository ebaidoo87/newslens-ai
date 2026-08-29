import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";


import userEvent from "@testing-library/user-event";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

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

import {
  registerUser,
} from "../../../shared/services/authApi";

import RegisterPage from "./RegisterPage";


vi.mock(
  "../../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


vi.mock(
  "../../../shared/services/authApi",
  () => ({
    registerUser: vi.fn(),
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

const mockRegisterUser =
  vi.mocked(
    registerUser,
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


function LoginDestination() {
  const location =
    useLocation();

  const state =
    location.state as {
      registrationSuccess?: boolean;
    } | null;


  return (
    <div>
      <span>
        Login Page
      </span>

      <span data-testid="registration-success">
        {String(
          state?.registrationSuccess
          ?? false,
        )}
      </span>
    </div>
  );
}


function renderRegisterPage() {
  return render(
    <MemoryRouter
      initialEntries={[
        "/register",
      ]}
    >
      <Routes>
        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />

        <Route
          path="/login"
          element={
            <LoginDestination />
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
      </Routes>
    </MemoryRouter>,
  );
}


async function fillRegistrationForm(
  {
    username =
      "newuser",

    email =
      "newuser@example.com",

    password =
      "password123",

    confirmPassword =
      "password123",
  }: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {},
) {

  renderRegisterPage();

  const browserUser =
    userEvent.setup();


  await browserUser.type(
    screen.getByLabelText(
      "Username",
    ),
    username,
  );

  await browserUser.type(
    screen.getByLabelText(
      "Email",
    ),
    email,
  );

  await browserUser.type(
    screen.getByLabelText(
      "Password",
      {
        selector:
          "#register-password",
      },
    ),
    password,
  );

  await browserUser.type(
    screen.getByLabelText(
      "Confirm password",
    ),
    confirmPassword,
  );


  return browserUser;
}


describe(
  "RegisterPage",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();


      mockUseAuth
        .mockReturnValue(
          createAuthState(),
        );


      mockRegisterUser
        .mockResolvedValue({
          id: 1,

          email:
            "newuser@example.com",

          username:
            "newuser",

          role:
            "user",
        });


      mockNormalizeApiError
        .mockReturnValue({
          message:
            "Registration failed.",

          status:
            null,

          code:
            "UNKNOWN_ERROR",
        });
    });


    it(
      "shows the loading state while authentication is being restored",
      () => {
        mockUseAuth
          .mockReturnValue(
            createAuthState({
              isLoading:
                true,
            }),
          );


        renderRegisterPage();


        expect(
          screen.getByText(
            "Loading...",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByRole(
            "heading",
            {
              name:
                "Create your account",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "redirects authenticated users to home",
      () => {
        mockUseAuth
          .mockReturnValue(
            createAuthState({
              isAuthenticated:
                true,
            }),
          );


        renderRegisterPage();


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
                "Create your account",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "submits valid registration credentials",
      async () => {
        const browserUser =
          await fillRegistrationForm();


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create account",
            },
          ),
        );


        await waitFor(
          () => {
            expect(
              mockRegisterUser,
            ).toHaveBeenCalledWith({
              username:
                "newuser",

              email:
                "newuser@example.com",

              password:
                "password123",
            });
          },
        );
      },
    );


    it(
      "redirects to login with registration success state after registration",
      async () => {
        const browserUser =
          await fillRegistrationForm();


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create account",
            },
          ),
        );


        expect(
          await screen.findByText(
            "Login Page",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByTestId(
            "registration-success",
          ),
        ).toHaveTextContent(
          "true",
        );
      },
    );


    it(
      "rejects mismatched passwords without calling the API",
      async () => {
        const browserUser =
          await fillRegistrationForm({
            password:
              "password123",

            confirmPassword:
              "different123",
          });


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create account",
            },
          ),
        );


        expect(
          screen.getByText(
            "Passwords do not match.",
          ),
        ).toBeInTheDocument();


        expect(
          mockRegisterUser,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "rejects passwords shorter than eight characters",
      async () => {
        renderRegisterPage();

        const browserUser =
          userEvent.setup();


        await browserUser.type(
          screen.getByLabelText(
            "Username",
          ),
          "newuser",
        );

        await browserUser.type(
          screen.getByLabelText(
            "Email",
          ),
          "newuser@example.com",
        );

        await browserUser.type(
          screen.getByLabelText(
            "Password",
            {
              selector:
                "#register-password",
            },
          ),
          "short",
        );

        await browserUser.type(
          screen.getByLabelText(
            "Confirm password",
          ),
          "short",
        );


        const form =
          screen
            .getByRole(
              "button",
              {
                name:
                  "Create account",
              },
            )
            .closest(
              "form",
            );


        expect(
            form,
            ).not.toBeNull();


            fireEvent.submit(
            form!,
            );


        expect(
            await screen.findByText(
                "Password must contain at least 8 characters.",
            ),
            ).toBeInTheDocument();

         expect(
            mockRegisterUser,
            ).not.toHaveBeenCalled();


        expect(
          await screen.findByText(
            "Password must contain at least 8 characters.",
          ),
        ).toBeInTheDocument();


        expect(
          mockRegisterUser,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "shows normalized backend errors",
      async () => {
        const requestError =
          new Error(
            "Conflict",
          );


        mockRegisterUser
          .mockRejectedValue(
            requestError,
          );


        mockNormalizeApiError
          .mockReturnValue({
            message:
              "An account with this email already exists.",

            status:
              409,

            code:
              "ACCOUNT_EXISTS",
          });


        const browserUser =
          await fillRegistrationForm();


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create account",
            },
          ),
        );


        expect(
          await screen.findByText(
            "An account with this email already exists.",
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
      "disables the submit button while registration is in progress",
      async () => {
        let resolveRegistration:
          (() => void)
          | undefined;


        const pendingRegistration =
          new Promise<
            Awaited<
              ReturnType<
                typeof registerUser
              >
            >
          >(
            (resolve) => {
              resolveRegistration =
                () => {
                  resolve({
                    id: 1,

                    email:
                      "newuser@example.com",

                    username:
                      "newuser",

                    role:
                      "user",
                  });
                };
            },
          );


        mockRegisterUser
          .mockReturnValue(
            pendingRegistration,
          );


        const browserUser =
          await fillRegistrationForm();


        await browserUser.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create account",
            },
          ),
        );


        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Creating account...",
            },
          ),
        ).toBeDisabled();


        resolveRegistration?.();


        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Login Page",
              ),
            ).toBeInTheDocument();
          },
        );
      },
    );
  },
);