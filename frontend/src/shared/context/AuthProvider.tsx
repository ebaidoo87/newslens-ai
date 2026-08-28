import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutAllDevices,
  type AuthUser,
  type LoginCredentials,
} from "../services/authApi";

import {
  AUTH_SESSION_EXPIRED_EVENT,
  TOKEN_STORAGE_KEY,
} from "../api/interceptors";

import {
  AuthContext,
} from "./AuthContext";


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    token,
    setToken,
  ] = useState<string | null>(
    () =>
      localStorage.getItem(
        TOKEN_STORAGE_KEY,
      ),
  );

  const [
    user,
    setUser,
  ] = useState<AuthUser | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const isAuthenticated =
    Boolean(
      token
      && user,
    );

  const isAdmin =
    user?.role === "admin";


  const clearSession =
    useCallback((): void => {
      localStorage.removeItem(
        TOKEN_STORAGE_KEY,
      );

      setToken(null);
      setUser(null);
    }, []);


  const refreshUser =
    useCallback(
      async (): Promise<void> => {
        const currentUser =
          await getCurrentUser();

        setUser(
          currentUser,
        );
      },
      [],
    );


  useEffect(() => {
    async function restoreSession():
    Promise<void> {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        await refreshUser();
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, [
    token,
    refreshUser,
    clearSession,
  ]);

  useEffect(() => {
    function handleExpiredSession():
    void {
      clearSession();
    }

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleExpiredSession,
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleExpiredSession,
      );
    };
  }, [
    clearSession,
  ]);


  async function login(
    credentials: LoginCredentials,
  ): Promise<void> {
    setIsLoading(true);

    try {
      const response =
        await loginUser(
          credentials,
        );

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        response.access_token,
      );

      setToken(
        response.access_token,
      );

      const currentUser =
        await getCurrentUser();

      setUser(
        currentUser,
      );
    } catch (error) {
      clearSession();

      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logoutAll():
Promise<void> {
  try {
    if (token) {
      await logoutAllDevices();
    }
  } finally {
    clearSession();
  }
}


  function logout(): void {
    clearSession();
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        logout,
        logoutAll,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}