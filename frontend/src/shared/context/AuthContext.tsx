import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  type AuthUser,
  type LoginCredentials,
} from "../services/authApi";

import {
  TOKEN_STORAGE_KEY,
} from "../api/interceptors";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;

  refreshUser: () => Promise<void>;
} 
  
const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY),
  );

  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser(): Promise<void> {
    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
  }


  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        localStorage.removeItem(
          TOKEN_STORAGE_KEY,
        );

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function login(
    credentials: LoginCredentials,
  ): Promise<void> {
    const result =
      await loginUser(credentials);

    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      result.access_token,
    );

    setToken(result.access_token);

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  }

  function logout(): void {
    localStorage.removeItem(
      TOKEN_STORAGE_KEY,
    );

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return context;
}