import { USE_MOCK_DATA, apiRequest, mockDelay, tokenStore } from "./client";
import type { AuthUser, LoginResponse, UserRole } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * PROTOTYPE ACCOUNTS — only used while VITE_USE_MOCK_DATA=true.
 * With mock mode disabled every credential is validated by FastAPI.
 */
const PROTOTYPE_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  "commissioner@thermoshield.gov": {
    password: "thermoshield",
    user: {
      id: "USR-001",
      name: "R. Anandhi",
      email: "commissioner@thermoshield.gov",
      role: "MUNICIPAL_AUTHORITY",
      designation: "Administrator",
      jurisdiction: "Greater Chennai Corporation",
    },
  },
  "dmo@thermoshield.gov": {
    password: "thermoshield",
    user: {
      id: "USR-002",
      name: "V. Karthikeyan",
      email: "dmo@thermoshield.gov",
      role: "DISASTER_MANAGEMENT_OFFICER",
      designation: "Disaster Management Officer",
      jurisdiction: "Chennai District Disaster Management Authority",
    },
  },
  "health@thermoshield.gov": {
    password: "thermoshield",
    user: {
      id: "USR-003",
      name: "Dr. S. Lakshmi",
      email: "health@thermoshield.gov",
      role: "HEALTHCARE_AUTHORITY",
      designation: "Deputy Director, Public Health",
      jurisdiction: "Public Health Department, Chennai",
    },
  },
  "field@thermoshield.gov": {
    password: "thermoshield",
    user: {
      id: "USR-004",
      name: "M. Prakash",
      email: "field@thermoshield.gov",
      role: "FIELD_OFFICER",
      designation: "Field Officer",
      jurisdiction: "Zone 10 — Kodambakkam",
      assignedWards: ["W128", "W135"],
    },
  },
  "citizen@thermoshield.gov": {
    password: "thermoshield",
    user: {
      id: "USR-005",
      name: "Public Access",
      email: "citizen@thermoshield.gov",
      role: "CITIZEN",
      designation: "Citizen",
      jurisdiction: "Chennai",
    },
  },
};

export const PROTOTYPE_ACCOUNT_LIST = Object.values(PROTOTYPE_ACCOUNTS).map((a) => ({
  email: a.user.email,
  role: a.user.role,
  designation: a.user.designation,
}));

export const authApi = {
  /** POST /auth/login */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    if (USE_MOCK_DATA) {
      const account = PROTOTYPE_ACCOUNTS[payload.email.trim().toLowerCase()];
      if (!account || account.password !== payload.password) {
        throw new Error("Invalid credentials. Access is restricted to authorised government users.");
      }
      return mockDelay({
        accessToken: `prototype.${account.user.id}.access`,
        refreshToken: `prototype.${account.user.id}.refresh`,
        user: account.user,
      });
    }
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email: payload.email, password: payload.password },
      auth: false,
    });
  },

  /** GET /auth/me */
  async me(): Promise<AuthUser> {
    if (USE_MOCK_DATA) {
      const token = tokenStore.access ?? "";
      const id = token.split(".")[1];
      const account = Object.values(PROTOTYPE_ACCOUNTS).find((a) => a.user.id === id);
      if (!account) throw new Error("Session expired. Please sign in again.");
      return mockDelay(account.user, 150);
    }
    return apiRequest<AuthUser>("/auth/me");
  },

  /** POST /auth/logout */
  async logout(): Promise<void> {
    if (!USE_MOCK_DATA) {
      try {
        await apiRequest<void>("/auth/logout", { method: "POST" });
      } catch {
        // Session is cleared locally regardless of backend availability.
      }
    }
    tokenStore.clear();
  },
};
