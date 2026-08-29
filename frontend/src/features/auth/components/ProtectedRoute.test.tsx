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
} from "../../../shared/hooks/useAuth";

import ProtectedRoute from "./ProtectedRoute";


vi.mock(
  "../../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


const mockUseAuth =
  vi.mocked(
    useAuth,
  );


function LoginDestination() {
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


function renderProtectedRoute(
  initialEntry =
    "/saved?page=2",
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialEntry,
      ]}
    >
      <Routes>
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <div>
                Protected Content
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <LoginDestination />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}


describe(
  "ProtectedRoute",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });


    it(
      "shows restoration state while authentication is loading",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                true,

              isAuthenticated:
                false,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderProtectedRoute();


        expect(
          screen.getByText(
            "Restoring your session...",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Protected Content",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "renders children for authenticated users",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                false,

              isAuthenticated:
                true,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderProtectedRoute();


        expect(
          screen.getByText(
            "Protected Content",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Login Page",
          ),
        ).not.toBeInTheDocument();
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
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderProtectedRoute();


        expect(
          screen.getByText(
            "Login Page",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Protected Content",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "preserves pathname and search when redirecting to login",
      () => {
        mockUseAuth
          .mockReturnValue(
            {
              isLoading:
                false,

              isAuthenticated:
                false,
            } as ReturnType<
              typeof useAuth
            >,
          );


        renderProtectedRoute(
          "/saved?page=2",
        );


        expect(
          screen.getByTestId(
            "from-path",
          ),
        ).toHaveTextContent(
          "/saved",
        );


        expect(
          screen.getByTestId(
            "from-search",
          ),
        ).toHaveTextContent(
          "?page=2",
        );
      },
    );
  },
);