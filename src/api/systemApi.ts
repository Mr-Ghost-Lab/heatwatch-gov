import { USE_MOCK_DATA, apiRequest, getLastSuccessfulRequestAt, mockDelay } from "./client";
import { mockSystemStatus } from "@/mocks/thermoshield";
import type { SystemStatusResponse } from "@/types";

export const systemApi = {
  /** GET /system/status */
  async getStatus(): Promise<SystemStatusResponse> {
    if (USE_MOCK_DATA) {
      const status = mockSystemStatus();
      return mockDelay({
        ...status,
        lastSuccessfulRequest: getLastSuccessfulRequestAt() ?? status.lastSuccessfulRequest,
      });
    }
    return apiRequest<SystemStatusResponse>("/system/status");
  },
};
