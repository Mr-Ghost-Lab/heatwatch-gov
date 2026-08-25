import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_WARDS, mockForecast } from "@/mocks/thermoshield";
import type { HealthImpact, RiskLevel } from "@/types";

export interface HealthRiskResponse {
  wardId: string;
  wardName: string;
  impact: HealthImpact;
  baselineAdmissionsPerDay: number;
  projectedAdmissionsPerDay: number;
  trend: { label: string; hospitalisationRiskPct: number; mortalityRisk: RiskLevel }[];
}

export const healthRiskApi = {
  /** GET /health-risk/{wardId} */
  get(wardId: string): Promise<HealthRiskResponse> {
    if (USE_MOCK_DATA) {
      const ward = MOCK_WARDS.find((w) => w.id === wardId);
      if (!ward) return Promise.reject(new Error(`Ward ${wardId} not found.`));
      const baseline = Math.max(6, Math.round(ward.population.totalPopulation / 9000));
      return mockDelay({
        wardId: ward.id,
        wardName: ward.name,
        impact: ward.health,
        baselineAdmissionsPerDay: baseline,
        projectedAdmissionsPerDay: Math.round(baseline * (1 + ward.health.hospitalisationRiskPct / 100)),
        trend: mockForecast(ward.id).map((day) => ({
          label: day.label,
          hospitalisationRiskPct: Math.max(0, Math.round((day.wbgt - 24) * 3.4)),
          mortalityRisk: day.healthRisk,
        })),
      });
    }
    return apiRequest<HealthRiskResponse>(`/health-risk/${encodeURIComponent(wardId)}`);
  },
};
