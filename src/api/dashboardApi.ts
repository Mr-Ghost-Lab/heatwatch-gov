import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { mockDashboard } from "@/mocks/thermoshield";
import type { DashboardSummary } from "@/types";

export const dashboardApi = {
  /** GET /dashboard/summary */
  getSummary(): Promise<DashboardSummary> {
    if (USE_MOCK_DATA) return mockDelay(mockDashboard());
    return apiRequest<DashboardSummary>("/dashboard/summary");
  },
};
