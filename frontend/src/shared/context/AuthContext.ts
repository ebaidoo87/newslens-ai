import {
  createContext,
} from "react";

import type {
  AuthUser,
  LoginCredentials,
} from "../services/authApi";


export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;

  logout: () => void;

  logoutAll: () => Promise<void>;

  refreshUser: () => Promise<void>;
}


export const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);