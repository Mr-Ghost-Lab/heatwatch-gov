export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type UserRole =
  | "MUNICIPAL_AUTHORITY"
  | "DISASTER_MANAGEMENT_OFFICER"
  | "HEALTHCARE_AUTHORITY"
  | "FIELD_OFFICER"
  | "CITIZEN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  jurisdiction: string;
  assignedWards?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface WeatherConditions {
  temperatureC: number;
  humidityPct: number;
  windSpeedKmph: number;
  solarRadiation: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
}

export interface ThermalStress {
  wbgt: number;
  utci: number;
  heatIndex: number;
  trend: "RISING" | "STABLE" | "FALLING";
}

export interface HealthImpact {
  hospitalisationRiskPct: number;
  mortalityRisk: RiskLevel;
  forecastHorizon: string;
  confidencePct: number;
}

export interface RiskDriver {
  factor: string;
  direction: "UP" | "DOWN" | "NEUTRAL";
  contributionPct: number;
  note: string;
}

export interface PopulationProfile {
  totalPopulation: number;
  populationDensity: number;
  elderly: number;
  children: number;
  outdoorWorkers: number;
  lowIncomeHouseholds: number;
  vulnerableTotal: number;
}

export interface Ward {
  id: string;
  name: string;
  zone: string;
  city: string;
  riskLevel: RiskLevel;
  riskIndex: number;
  weather: WeatherConditions;
  thermalStress: ThermalStress;
  health: HealthImpact;
  population: PopulationProfile;
  drivers: RiskDriver[];
  centroid: [number, number];
}

export interface WardGeoFeature {
  type: "Feature";
  id: number;
  properties: {
    wardId: string;
    name: string;
    riskLevel: RiskLevel;
    riskIndex: number;
    temperatureC: number;
    fillColor: string;
  };
  geometry: { type: "Polygon"; coordinates: number[][][] };
}

export interface RiskMapResponse {
  updatedAt: string;
  geojson: { type: "FeatureCollection"; features: WardGeoFeature[] };
}

export interface DashboardSummary {
  updatedAt: string;
  jurisdiction: string;
  criticalWard: Ward;
  counts: Record<RiskLevel, number>;
  populationExposed: number;
  activeAlerts: number;
  pendingActions: number;
  forecastPeak: { day: string; temperatureC: number; riskLevel: RiskLevel };
}

export interface ForecastDay {
  label: string;
  date: string;
  temperatureC: number;
  minTemperatureC: number;
  humidityPct: number;
  wbgt: number;
  utci: number;
  heatIndex: number;
  riskLevel: RiskLevel;
  healthRisk: RiskLevel;
  confidencePct: number;
}

export type AlertCategory = "CRITICAL" | "HIGH" | "MODERATE" | "INFORMATIONAL";

export interface HeatAlert {
  id: string;
  title: string;
  category: AlertCategory;
  wardId: string;
  location: string;
  issuedAt: string;
  expectedDuration: string;
  reason: string;
  recommendedAction: string;
  responsibleAuthority: string;
  channels: string[];
  read: boolean;
}

export type ActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type ActionWindow = "IMMEDIATE_0_6H" | "WITHIN_12H" | "WITHIN_48H";

export interface InterventionAction {
  id: string;
  title: string;
  window: ActionWindow;
  wardId: string;
  location: string;
  status: ActionStatus;
  responsibleOfficer: string;
  deadline: string;
  notes?: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  type: string;
  period: string;
  generatedAt: string | null;
  status: "AVAILABLE" | "NOT_GENERATED" | "GENERATING";
  format: string;
}

export interface AnalyticsOverview {
  riskTrend: { date: string; riskIndex: number; temperatureC: number }[];
  wardComparison: { ward: string; riskIndex: number; exposed: number }[];
  healthTrend: { date: string; hospitalisation: number; mortalityIndex: number }[];
  alertStats: { category: AlertCategory; count: number }[];
  interventionCompletion: { status: ActionStatus; count: number }[];
  historicalEvents: { year: string; events: number; peakTemp: number }[];
}

export interface ServiceStatus {
  name: string;
  status: "OPERATIONAL" | "DEGRADED" | "OFFLINE";
  latencyMs: number | null;
  lastCheck: string;
}

export interface SystemStatusResponse {
  services: ServiceStatus[];
  lastDataUpdate: string;
  lastSuccessfulRequest: string;
  modelStatus: string;
  modelVersion: string;
}
