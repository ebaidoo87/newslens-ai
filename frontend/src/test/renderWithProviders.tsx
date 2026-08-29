import type {
  ReactElement,
  ReactNode,
} from "react";

import {
  render,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


interface RenderWithProvidersOptions {
  route?: string;
}


function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },

      mutations: {
        retry: false,
      },
    },
  });
}


export function renderWithProviders(
  ui: ReactElement,
  {
    route = "/",
  }: RenderWithProvidersOptions = {},
) {
  const queryClient =
    createTestQueryClient();


  return render(
    ui,
    {
      wrapper: ({
        children,
      }: {
        children: ReactNode;
      }) => (
        <MemoryRouter
          initialEntries={[
            route,
          ]}
        >
          <QueryClientProvider
            client={queryClient}
          >
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      ),
    },
  );
}