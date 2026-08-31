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
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  QueryClient,
} from "@tanstack/react-query";


interface RenderWithProvidersOptions {
  route?: string;
}


export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
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