import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { mockForecast } from "@/mocks/thermoshield";
import type { ForecastDay } from "@/types";

export const forecastApi = {
  /** GET /forecast */
  getForecast(): Promise<ForecastDay[]> {
    if (USE_MOCK_DATA) return mockDelay(mockForecast());
    return apiRequest<ForecastDay[]>("/forecast");
  },

  /** GET /forecast/ward/{wardId} */
  getWardForecast(wardId: string): Promise<ForecastDay[]> {
    if (USE_MOCK_DATA) return mockDelay(mockForecast(wardId), 320);
    return apiRequest<ForecastDay[]>(`/forecast/ward/${encodeURIComponent(wardId)}`);
  },
};
