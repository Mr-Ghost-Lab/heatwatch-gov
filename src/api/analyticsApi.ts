import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { mockAnalytics } from "@/mocks/thermoshield";
import type { AnalyticsOverview } from "@/types";

export const analyticsApi = {
  /** GET /analytics/overview */
  getOverview(): Promise<AnalyticsOverview> {
    if (USE_MOCK_DATA) return mockDelay(mockAnalytics(), 360);
    return apiRequest<AnalyticsOverview>("/analytics/overview");
  },
};
