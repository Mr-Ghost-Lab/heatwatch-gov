import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_ALERTS } from "@/mocks/thermoshield";
import type { HeatAlert } from "@/types";

// Prototype-only in-memory store so alert state changes persist during a session.
let mockAlerts: HeatAlert[] = MOCK_ALERTS.map((a) => ({ ...a }));

export const alertsApi = {
  /** GET /alerts */
  list(): Promise<HeatAlert[]> {
    if (USE_MOCK_DATA) return mockDelay(mockAlerts.map((a) => ({ ...a })), 300);
    return apiRequest<HeatAlert[]>("/alerts");
  },

  /** GET /alerts/{alertId} */
  get(alertId: string): Promise<HeatAlert> {
    if (USE_MOCK_DATA) {
      const alert = mockAlerts.find((a) => a.id === alertId);
      if (!alert) return Promise.reject(new Error(`Alert ${alertId} not found.`));
      return mockDelay({ ...alert }, 180);
    }
    return apiRequest<HeatAlert>(`/alerts/${encodeURIComponent(alertId)}`);
  },

  /** PATCH /alerts/{alertId}/read */
  markRead(alertId: string): Promise<HeatAlert> {
    if (USE_MOCK_DATA) {
      mockAlerts = mockAlerts.map((a) => (a.id === alertId ? { ...a, read: true } : a));
      const updated = mockAlerts.find((a) => a.id === alertId);
      if (!updated) return Promise.reject(new Error(`Alert ${alertId} not found.`));
      return mockDelay({ ...updated }, 180);
    }
    return apiRequest<HeatAlert>(`/alerts/${encodeURIComponent(alertId)}/read`, { method: "PATCH" });
  },
};
