"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, ApiError } from "@/lib/api-client";
import type { User } from "@/types/models";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // No token = not loading, skip the API call entirely
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      return { user: null, isLoading: false, isAuthenticated: false };
    }
    return { user: null, isLoading: true, isAuthenticated: false };
  });

  const setUser = useCallback((user: User | null) => {
    setState({
      user,
      isLoading: false,
      isAuthenticated: user !== null,
    });
  }, []);

  useEffect(() => {
    if (!state.isLoading) return;

    api
      .get<User>("/me")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, [state.isLoading, setUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<{ user: User; token: string }>("/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    },
    [setUser],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await api.post<{ user: User; token: string }>("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/logout", {});
    } catch {
      // Ignore — token might already be invalid
    }
    localStorage.removeItem("token");
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { ApiError };
