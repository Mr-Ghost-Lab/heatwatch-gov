import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_WARDS, mockRiskMap } from "@/mocks/thermoshield";
import type { RiskMapResponse, Ward } from "@/types";

export const riskApi = {
  /** GET /risk/map */
  getRiskMap(): Promise<RiskMapResponse> {
    if (USE_MOCK_DATA) return mockDelay(mockRiskMap(), 300);
    return apiRequest<RiskMapResponse>("/risk/map");
  },

  /** GET /risk/ward/{wardId} */
  getWard(wardId: string): Promise<Ward> {
    if (USE_MOCK_DATA) {
      const ward = MOCK_WARDS.find((w) => w.id === wardId);
      if (!ward) return Promise.reject(new Error(`Ward ${wardId} not found.`));
      return mockDelay(ward, 220);
    }
    return apiRequest<Ward>(`/risk/ward/${encodeURIComponent(wardId)}`);
  },

  /** Convenience listing derived from GET /risk/map */
  listWards(): Promise<Ward[]> {
    if (USE_MOCK_DATA) return mockDelay(MOCK_WARDS, 260);
    return apiRequest<Ward[]>("/risk/map", { query: { format: "list" } });
  },
};
