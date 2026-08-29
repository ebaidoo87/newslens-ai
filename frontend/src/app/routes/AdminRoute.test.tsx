import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  useAuth,
} from "../../shared/hooks/useAuth";

import AdminRoute from "./AdminRoute";


vi.mock(
  "../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


const mockUseAuth =
  vi.mocked(
    useAuth,
  );


function LoginPageStub() {
  const location =
    useLocation();

  const state =
    location.state as {
      from?: {
        pathname?: string;
        search?: string;
      };
    } | null;


  return (
    <div>
      <span>
        Login Page
      </span>

      <span data-testid="from-path">
        {state?.from?.pathname
          ?? "none"}
      </span>

      <span data-testid="from-search">
        {state?.from?.search
          ?? "none"}
      </span>
    </div>
  );
}


function renderAdminRoute(
  initialEntry =
    "/admin/users?status=active",
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialEntry,
      ]}
    >
      <Routes>
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <div>
                Admin Content
              </div>
            </AdminRoute>
          }
        />

        <Route
          path="/login"
          element={
            <LoginPageStub />
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


describe(
  "AdminRoute",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });


    it(
      "shows permission-checking state while authentication is loading",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                true,

              isAuthenticated:
                false,

              isAdmin:
                false,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderAdminRoute();


        expect(
          screen.getByText(
            "Checking permissions...",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Admin Content",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "renders admin content for authenticated administrators",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                false,

              isAuthenticated:
                true,

              isAdmin:
                true,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderAdminRoute();


        expect(
          screen.getByText(
            "Admin Content",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "redirects unauthenticated users to login",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                false,

              isAuthenticated:
                false,

              isAdmin:
                false,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderAdminRoute();


        expect(
          screen.getByText(
            "Login Page",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByTestId(
            "from-path",
          ),
        ).toHaveTextContent(
          "/admin/users",
        );


        expect(
          screen.getByTestId(
            "from-search",
          ),
        ).toHaveTextContent(
          "?status=active",
        );
      },
    );


    it(
      "redirects authenticated non-admin users to home",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                false,

              isAuthenticated:
                true,

              isAdmin:
                false,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderAdminRoute();


        expect(
          screen.getByText(
            "Home Page",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Admin Content",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);