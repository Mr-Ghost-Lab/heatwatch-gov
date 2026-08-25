import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_WARDS } from "@/mocks/thermoshield";
import type { PopulationProfile } from "@/types";

export interface PopulationResponse {
  wardId: string;
  wardName: string;
  profile: PopulationProfile;
  cohorts: { label: string; value: number; sharePct: number }[];
}

export const populationApi = {
  /** GET /population/{wardId} */
  get(wardId: string): Promise<PopulationResponse> {
    if (USE_MOCK_DATA) {
      const ward = MOCK_WARDS.find((w) => w.id === wardId);
      if (!ward) return Promise.reject(new Error(`Ward ${wardId} not found.`));
      const p = ward.population;
      const cohort = (label: string, value: number) => ({
        label,
        value,
        sharePct: +((value / p.totalPopulation) * 100).toFixed(1),
      });
      return mockDelay({
        wardId: ward.id,
        wardName: ward.name,
        profile: p,
        cohorts: [
          cohort("Elderly (60+ years)", p.elderly),
          cohort("Children (0–12 years)", p.children),
          cohort("Outdoor workers", p.outdoorWorkers),
          cohort("Low-income households", p.lowIncomeHouseholds),
        ],
      });
    }
    return apiRequest<PopulationResponse>(`/population/${encodeURIComponent(wardId)}`);
  },
};
