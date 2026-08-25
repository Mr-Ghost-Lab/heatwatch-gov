import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_WARDS } from "@/mocks/thermoshield";
import type { RiskDriver, ThermalStress } from "@/types";

export interface ThermalStressResponse {
  wardId: string;
  wardName: string;
  thermalStress: ThermalStress;
  drivers: RiskDriver[];
  explanation: string[];
}

export const thermalStressApi = {
  /** GET /thermal-stress/{wardId} */
  get(wardId: string): Promise<ThermalStressResponse> {
    if (USE_MOCK_DATA) {
      const ward = MOCK_WARDS.find((w) => w.id === wardId);
      if (!ward) return Promise.reject(new Error(`Ward ${wardId} not found.`));
      return mockDelay({
        wardId: ward.id,
        wardName: ward.name,
        thermalStress: ward.thermalStress,
        drivers: ward.drivers,
        explanation: [
          `Relative humidity of ${ward.weather.humidityPct}% suppresses evaporative cooling of the human body.`,
          `Wind circulation of ${ward.weather.windSpeedKmph} km/h is insufficient to ventilate the dense built form.`,
          `${ward.weather.solarRadiation} solar radiation with limited tree canopy raises the radiant heat load.`,
          `${ward.population.outdoorWorkers.toLocaleString("en-IN")} outdoor workers are exposed during peak-heat hours.`,
        ],
      });
    }
    return apiRequest<ThermalStressResponse>(`/thermal-stress/${encodeURIComponent(wardId)}`);
  },
};
