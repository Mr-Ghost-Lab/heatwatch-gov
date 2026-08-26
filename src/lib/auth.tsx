import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type LoginPayload } from "@/api/authApi";
import { tokenStore } from "@/api/client";
import type { AuthUser, UserRole } from "@/types";

interface AuthState {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "anonymous";
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  useEffect(() => {
    let cancelled = false;
    if (!tokenStore.access) {
      setStatus("anonymous");
      return;
    }
    authApi
      .me()
      .then((u) => {
        if (cancelled) return;
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        tokenStore.clear();
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    tokenStore.set(res.accessToken, res.refreshToken);
    setUser(res.user);
    setStatus("authenticated");
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo<AuthState>(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  MUNICIPAL_AUTHORITY: "Municipal Authority",
  DISASTER_MANAGEMENT_OFFICER: "Disaster Management Officer",
  HEALTHCARE_AUTHORITY: "Healthcare Authority",
  FIELD_OFFICER: "Field Officer",
  CITIZEN: "Citizen (Public Access)",
};
