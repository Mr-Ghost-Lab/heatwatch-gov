/**
 * PROTOTYPE / SIMULATED DATA ONLY.
 * Isolated mock layer used when VITE_USE_MOCK_DATA=true.
 * Production data must come from the external FastAPI backend.
 */
import type {
  AnalyticsOverview,
  DashboardSummary,
  ForecastDay,
  HeatAlert,
  InterventionAction,
  ReportDefinition,
  RiskLevel,
  RiskMapResponse,
  SystemStatusResponse,
  Ward,
  WardGeoFeature,
} from "@/types";

export const RISK_ORDER: RiskLevel[] = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

export const RISK_HEX: Record<RiskLevel, string> = {
  LOW: "#2f7d4f",
  MODERATE: "#c08a1e",
  HIGH: "#c4611f",
  CRITICAL: "#b02418",
};

function riskFromIndex(index: number): RiskLevel {
  if (index >= 80) return "CRITICAL";
  if (index >= 65) return "HIGH";
  if (index >= 45) return "MODERATE";
  return "LOW";
}

const WARD_SEED: {
  id: string;
  name: string;
  zone: string;
  riskIndex: number;
  temp: number;
  humidity: number;
  wind: number;
  pop: number;
}[] = [
  { id: "W128", name: "Ward 128", zone: "Zone 10 — Kodambakkam", riskIndex: 91, temp: 42.1, humidity: 68, wind: 12, pop: 184200 },
  { id: "W135", name: "Ward 135", zone: "Zone 11 — Valasaravakkam", riskIndex: 86, temp: 41.6, humidity: 64, wind: 10, pop: 152400 },
  { id: "W098", name: "Ward 98", zone: "Zone 8 — Anna Nagar", riskIndex: 82, temp: 41.2, humidity: 61, wind: 14, pop: 141800 },
  { id: "W112", name: "Ward 112", zone: "Zone 9 — Teynampet", riskIndex: 74, temp: 40.4, humidity: 66, wind: 15, pop: 128900 },
  { id: "W061", name: "Ward 61", zone: "Zone 5 — Royapuram", riskIndex: 70, temp: 40.1, humidity: 71, wind: 17, pop: 118300 },
  { id: "W147", name: "Ward 147", zone: "Zone 12 — Alandur", riskIndex: 67, temp: 39.8, humidity: 58, wind: 13, pop: 96500 },
  { id: "W042", name: "Ward 42", zone: "Zone 4 — Tondiarpet", riskIndex: 58, temp: 38.9, humidity: 74, wind: 19, pop: 88700 },
  { id: "W073", name: "Ward 73", zone: "Zone 6 — Thiru-Vi-Ka Nagar", riskIndex: 54, temp: 38.4, humidity: 69, wind: 20, pop: 79200 },
  { id: "W019", name: "Ward 19", zone: "Zone 2 — Manali", riskIndex: 49, temp: 37.8, humidity: 63, wind: 22, pop: 61400 },
  { id: "W155", name: "Ward 155", zone: "Zone 13 — Adyar", riskIndex: 44, temp: 37.1, humidity: 72, wind: 24, pop: 74600 },
  { id: "W167", name: "Ward 167", zone: "Zone 14 — Perungudi", riskIndex: 38, temp: 36.5, humidity: 75, wind: 26, pop: 68900 },
  { id: "W180", name: "Ward 180", zone: "Zone 15 — Sholinganallur", riskIndex: 31, temp: 35.7, humidity: 78, wind: 28, pop: 57300 },
];

function solarFor(index: number): Ward["weather"]["solarRadiation"] {
  if (index >= 80) return "VERY HIGH";
  if (index >= 65) return "HIGH";
  if (index >= 45) return "MODERATE";
  return "LOW";
}

function driversFor(seed: (typeof WARD_SEED)[number]): Ward["drivers"] {
  return [
    {
      factor: "Air Temperature",
      direction: "UP",
      contributionPct: 32,
      note: `${seed.temp.toFixed(1)}°C, ${(seed.temp - 34.2).toFixed(1)}°C above seasonal normal`,
    },
    {
      factor: "Relative Humidity",
      direction: seed.humidity > 60 ? "UP" : "NEUTRAL",
      contributionPct: 24,
      note: `${seed.humidity}% — limits evaporative cooling`,
    },
    {
      factor: "Wind Circulation",
      direction: "DOWN",
      contributionPct: 17,
      note: `${seed.wind} km/h — restricted ventilation in dense built form`,
    },
    {
      factor: "Solar / Radiant Heat",
      direction: "UP",
      contributionPct: 15,
      note: `${solarFor(seed.riskIndex)} radiant load, low tree canopy cover`,
    },
    {
      factor: "Population Vulnerability",
      direction: seed.riskIndex >= 65 ? "UP" : "NEUTRAL",
      contributionPct: 12,
      note: "High elderly and outdoor-worker concentration",
    },
  ];
}

// Synthetic ward polygons laid out around Chennai for prototype GIS rendering.
function polygonFor(i: number): { coords: number[][][]; centroid: [number, number] } {
  const cols = 4;
  const originLng = 80.14;
  const originLat = 13.16;
  const w = 0.055;
  const h = 0.048;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const lng = originLng + col * w;
  const lat = originLat - row * h;
  const jitter = ((i % 3) - 1) * 0.004;
  const ring = [
    [lng, lat],
    [lng + w * 0.94, lat + jitter],
    [lng + w * 0.9, lat - h * 0.93],
    [lng + jitter * 0.5, lat - h * 0.96],
    [lng, lat],
  ];
  return { coords: [ring], centroid: [lng + w / 2, lat - h / 2] };
}

export const MOCK_WARDS: Ward[] = WARD_SEED.map((seed, i) => {
  const geo = polygonFor(i);
  const wbgt = +(seed.temp * 0.62 + seed.humidity * 0.12 - 0.08 * seed.wind).toFixed(1);
  const utci = +(seed.temp + seed.humidity * 0.09 - seed.wind * 0.12 + 1.8).toFixed(1);
  const heatIndex = +(seed.temp + seed.humidity * 0.2 + (seed.riskIndex > 70 ? 4.2 : 2.1)).toFixed(1);
  const elderly = Math.round(seed.pop * 0.104);
  const children = Math.round(seed.pop * 0.121);
  const workers = Math.round(seed.pop * 0.163);
  const lowIncome = Math.round(seed.pop * 0.212);
  return {
    id: seed.id,
    name: seed.name,
    zone: seed.zone,
    city: "Chennai, Tamil Nadu",
    riskLevel: riskFromIndex(seed.riskIndex),
    riskIndex: seed.riskIndex,
    weather: {
      temperatureC: seed.temp,
      humidityPct: seed.humidity,
      windSpeedKmph: seed.wind,
      solarRadiation: solarFor(seed.riskIndex),
    },
    thermalStress: {
      wbgt,
      utci,
      heatIndex,
      trend: seed.riskIndex >= 65 ? "RISING" : seed.riskIndex >= 45 ? "STABLE" : "FALLING",
    },
    health: {
      hospitalisationRiskPct: Math.round(seed.riskIndex * 0.3),
      mortalityRisk: riskFromIndex(seed.riskIndex),
      forecastHorizon: "3–5 Days",
      confidencePct: 78 + (i % 5),
    },
    population: {
      totalPopulation: seed.pop,
      populationDensity: Math.round(seed.pop / 8.4),
      elderly,
      children,
      outdoorWorkers: workers,
      lowIncomeHouseholds: lowIncome,
      vulnerableTotal: elderly + children + workers,
    },
    drivers: driversFor(seed),
    centroid: geo.centroid,
  };
});

export function mockRiskMap(): RiskMapResponse {
  const features: WardGeoFeature[] = MOCK_WARDS.map((ward, i) => ({
    type: "Feature",
    id: i + 1,
    properties: {
      wardId: ward.id,
      name: ward.name,
      riskLevel: ward.riskLevel,
      riskIndex: ward.riskIndex,
      temperatureC: ward.weather.temperatureC,
      fillColor: RISK_HEX[ward.riskLevel],
    },
    geometry: { type: "Polygon", coordinates: polygonFor(i).coords },
  }));
  return { updatedAt: new Date().toISOString(), geojson: { type: "FeatureCollection", features } };
}

export function mockDashboard(): DashboardSummary {
  const counts: Record<RiskLevel, number> = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
  MOCK_WARDS.forEach((w) => (counts[w.riskLevel] += 1));
  return {
    updatedAt: new Date().toISOString(),
    jurisdiction: "Greater Chennai Corporation — Chennai, Tamil Nadu",
    criticalWard: MOCK_WARDS[0],
    counts,
    populationExposed: MOCK_WARDS.filter((w) => w.riskLevel === "CRITICAL" || w.riskLevel === "HIGH").reduce(
      (sum, w) => sum + w.population.totalPopulation,
      0,
    ),
    activeAlerts: MOCK_ALERTS.filter((a) => a.category !== "INFORMATIONAL").length,
    pendingActions: MOCK_ACTIONS.filter((a) => a.status === "PENDING").length,
    forecastPeak: { day: "+2 Days", temperatureC: 43.6, riskLevel: "CRITICAL" },
  };
}

export function mockForecast(wardId = "W128"): ForecastDay[] {
  const ward = MOCK_WARDS.find((w) => w.id === wardId) ?? MOCK_WARDS[0];
  const offsets = [0, 0.6, 1.5, 0.4, -1.2, -2.4];
  const labels = ["Today", "+1 Day", "+2 Days", "+3 Days", "+4 Days", "+5 Days"];
  return offsets.map((delta, i) => {
    const temperatureC = +(ward.weather.temperatureC + delta).toFixed(1);
    const humidityPct = Math.max(38, Math.min(86, ward.weather.humidityPct + (i % 3) * 3 - 2));
    const riskIndex = Math.round(ward.riskIndex + delta * 6);
    const date = new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
    return {
      label: labels[i],
      date,
      temperatureC,
      minTemperatureC: +(temperatureC - 8.4).toFixed(1),
      humidityPct,
      wbgt: +(temperatureC * 0.62 + humidityPct * 0.12 - 0.08 * ward.weather.windSpeedKmph).toFixed(1),
      utci: +(temperatureC + humidityPct * 0.09 + 1.6).toFixed(1),
      heatIndex: +(temperatureC + humidityPct * 0.2 + 3).toFixed(1),
      riskLevel: riskFromIndex(riskIndex),
      healthRisk: riskFromIndex(riskIndex - 6),
      confidencePct: Math.max(58, 92 - i * 5),
    };
  });
}

export const MOCK_ALERTS: HeatAlert[] = [
  {
    id: "ALT-2041",
    title: "Red Alert — Extreme Heat, Ward 128",
    category: "CRITICAL",
    wardId: "W128",
    location: "Ward 128, Zone 10 — Kodambakkam",
    issuedAt: new Date(Date.now() - 42 * 60000).toISOString(),
    expectedDuration: "Next 18 hours (until 06:00 IST)",
    reason: "WBGT 33.8°C with sustained humidity above 65% and wind circulation below 12 km/h.",
    recommendedAction: "Activate cooling centres, deploy water stations, escalate emergency medical readiness.",
    responsibleAuthority: "Zonal Officer, Zone 10",
    channels: ["SMS", "WhatsApp", "Email", "Public Display"],
    read: false,
  },
  {
    id: "ALT-2039",
    title: "Orange Alert — High Thermal Stress, Ward 135",
    category: "HIGH",
    wardId: "W135",
    location: "Ward 135, Zone 11 — Valasaravakkam",
    issuedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    expectedDuration: "Next 12 hours",
    reason: "Heat index projected at 52°C during 12:00–16:00 window.",
    recommendedAction: "Reschedule outdoor works, notify vulnerable households, open shaded rest points.",
    responsibleAuthority: "Disaster Management Cell",
    channels: ["SMS", "Email"],
    read: false,
  },
  {
    id: "ALT-2036",
    title: "Orange Alert — Hospitalisation Risk Escalation",
    category: "HIGH",
    wardId: "W098",
    location: "Ward 98, Zone 8 — Anna Nagar",
    issuedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    expectedDuration: "72 hours",
    reason: "Health impact model projects +25% heat-related admissions above baseline.",
    recommendedAction: "Increase ORS stock and triage capacity at ward health posts.",
    responsibleAuthority: "Public Health Department",
    channels: ["Email", "Internal Dashboard"],
    read: true,
  },
  {
    id: "ALT-2030",
    title: "Yellow Alert — Moderate Heat Advisory, Ward 61",
    category: "MODERATE",
    wardId: "W061",
    location: "Ward 61, Zone 5 — Royapuram",
    issuedAt: new Date(Date.now() - 19 * 3600000).toISOString(),
    expectedDuration: "24 hours",
    reason: "Night-time temperatures remaining above 29°C, limiting physiological recovery.",
    recommendedAction: "Advisory to outdoor workers; monitor elderly care facilities.",
    responsibleAuthority: "Zonal Officer, Zone 5",
    channels: ["SMS"],
    read: true,
  },
  {
    id: "ALT-2024",
    title: "Information — Heat Action Plan Review Scheduled",
    category: "INFORMATIONAL",
    wardId: "W112",
    location: "Corporation-wide",
    issuedAt: new Date(Date.now() - 28 * 3600000).toISOString(),
    expectedDuration: "Not applicable",
    reason: "Quarterly review of the Municipal Heat Action Plan.",
    recommendedAction: "Departmental representatives to submit ward readiness status.",
    responsibleAuthority: "Municipal Commissioner's Office",
    channels: ["Email"],
    read: true,
  },
];

export const MOCK_ACTIONS: InterventionAction[] = [
  {
    id: "ACT-5011",
    title: "Open designated cooling centres (schools, community halls)",
    window: "IMMEDIATE_0_6H",
    wardId: "W128",
    location: "Ward 128, Zone 10",
    status: "IN_PROGRESS",
    responsibleOfficer: "R. Selvaraj, Zonal Officer",
    deadline: "Today, 16:00 IST",
  },
  {
    id: "ACT-5012",
    title: "Deploy mobile drinking water stations at 8 high-footfall points",
    window: "IMMEDIATE_0_6H",
    wardId: "W128",
    location: "Ward 128, Zone 10",
    status: "PENDING",
    responsibleOfficer: "K. Meenakshi, Works Engineer",
    deadline: "Today, 17:30 IST",
  },
  {
    id: "ACT-5013",
    title: "Escalate emergency medical readiness at ward health posts",
    window: "IMMEDIATE_0_6H",
    wardId: "W128",
    location: "Ward 128, Zone 10",
    status: "COMPLETED",
    responsibleOfficer: "Dr. A. Ramanathan, Health Officer",
    deadline: "Today, 14:00 IST",
  },
  {
    id: "ACT-5020",
    title: "Revise outdoor work hours for municipal contract labour",
    window: "WITHIN_12H",
    wardId: "W135",
    location: "Ward 135, Zone 11",
    status: "PENDING",
    responsibleOfficer: "S. Iyappan, Labour Coordinator",
    deadline: "Tomorrow, 08:00 IST",
  },
  {
    id: "ACT-5021",
    title: "Door-to-door advisory for elderly and bed-ridden residents",
    window: "WITHIN_12H",
    wardId: "W128",
    location: "Ward 128, Zone 10",
    status: "IN_PROGRESS",
    responsibleOfficer: "Field Officer Team B",
    deadline: "Tomorrow, 10:00 IST",
  },
  {
    id: "ACT-5030",
    title: "Coordinate power-demand contingency with distribution utility",
    window: "WITHIN_48H",
    wardId: "W098",
    location: "Zone 8 — Anna Nagar",
    status: "PENDING",
    responsibleOfficer: "Executive Engineer, Electrical",
    deadline: "In 2 days",
  },
  {
    id: "ACT-5031",
    title: "Activate Municipal Heat Action Plan — Stage II",
    window: "WITHIN_48H",
    wardId: "W128",
    location: "Corporation-wide",
    status: "PENDING",
    responsibleOfficer: "Deputy Commissioner (Health)",
    deadline: "In 2 days",
  },
  {
    id: "ACT-5032",
    title: "Joint review with District Disaster Management Authority",
    window: "WITHIN_48H",
    wardId: "W112",
    location: "Corporation-wide",
    status: "CANCELLED",
    responsibleOfficer: "Disaster Management Cell",
    deadline: "In 3 days",
    notes: "Deferred; merged with Stage II activation review.",
  },
];

export const MOCK_REPORTS: ReportDefinition[] = [
  { id: "RPT-DHR", name: "Daily Heat Risk Report", type: "Operational", period: "Today", generatedAt: new Date(Date.now() - 5400000).toISOString(), status: "AVAILABLE", format: "PDF" },
  { id: "RPT-WRR", name: "Ward Risk Report", type: "Operational", period: "Ward 128 — Today", generatedAt: new Date(Date.now() - 9000000).toISOString(), status: "AVAILABLE", format: "PDF" },
  { id: "RPT-FCT", name: "3–5 Day Forecast Report", type: "Forecast", period: "Rolling 5 days", generatedAt: null, status: "NOT_GENERATED", format: "PDF" },
  { id: "RPT-PVR", name: "Population Vulnerability Report", type: "Analytical", period: "Current quarter", generatedAt: new Date(Date.now() - 86400000).toISOString(), status: "AVAILABLE", format: "XLSX" },
  { id: "RPT-HIR", name: "Health Impact Report", type: "Health", period: "3–5 day horizon", generatedAt: null, status: "NOT_GENERATED", format: "PDF" },
  { id: "RPT-HER", name: "Heatwave Event Report", type: "Event", period: "Event 2026-04 (ongoing)", generatedAt: null, status: "NOT_GENERATED", format: "PDF" },
  { id: "RPT-INT", name: "Intervention Report", type: "Response", period: "Last 7 days", generatedAt: new Date(Date.now() - 172800000).toISOString(), status: "AVAILABLE", format: "PDF" },
];

export function mockAnalytics(): AnalyticsOverview {
  const riskTrend = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(5, 10);
    return { date, riskIndex: 52 + Math.round(Math.sin(i / 2.2) * 14) + i, temperatureC: +(37.2 + Math.sin(i / 2) * 2.1 + i * 0.18).toFixed(1) };
  });
  return {
    riskTrend,
    wardComparison: MOCK_WARDS.slice(0, 8).map((w) => ({ ward: w.name.replace("Ward ", "W"), riskIndex: w.riskIndex, exposed: w.population.vulnerableTotal })),
    healthTrend: Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - (9 - i) * 86400000).toISOString().slice(5, 10),
      hospitalisation: 8 + i * 2 + (i % 3),
      mortalityIndex: 3 + Math.round(i * 0.8),
    })),
    alertStats: [
      { category: "CRITICAL", count: 6 },
      { category: "HIGH", count: 14 },
      { category: "MODERATE", count: 21 },
      { category: "INFORMATIONAL", count: 9 },
    ],
    interventionCompletion: [
      { status: "COMPLETED", count: 34 },
      { status: "IN_PROGRESS", count: 12 },
      { status: "PENDING", count: 9 },
      { status: "CANCELLED", count: 3 },
    ],
    historicalEvents: [
      { year: "2021", events: 3, peakTemp: 40.2 },
      { year: "2022", events: 4, peakTemp: 41.1 },
      { year: "2023", events: 5, peakTemp: 42.0 },
      { year: "2024", events: 6, peakTemp: 42.8 },
      { year: "2025", events: 7, peakTemp: 43.4 },
      { year: "2026", events: 4, peakTemp: 43.6 },
    ],
  };
}

export function mockSystemStatus(): SystemStatusResponse {
  const now = new Date().toISOString();
  return {
    services: [
      { name: "Weather Data Feed", status: "OPERATIONAL", latencyMs: 182, lastCheck: now },
      { name: "Forecast Service", status: "OPERATIONAL", latencyMs: 341, lastCheck: now },
      { name: "GIS Service (PostGIS)", status: "OPERATIONAL", latencyMs: 96, lastCheck: now },
      { name: "AI / ML Service", status: "DEGRADED", latencyMs: 1420, lastCheck: now },
      { name: "Database (PostgreSQL / TimescaleDB)", status: "OPERATIONAL", latencyMs: 44, lastCheck: now },
      { name: "Alert Service", status: "OPERATIONAL", latencyMs: 210, lastCheck: now },
      { name: "FastAPI Backend", status: "OPERATIONAL", latencyMs: 128, lastCheck: now },
    ],
    lastDataUpdate: new Date(Date.now() - 12 * 60000).toISOString(),
    lastSuccessfulRequest: now,
    modelStatus: "Heat risk model and health impact model loaded",
    modelVersion: "XGBoost v1.4.2 / Scikit-learn v1.5.0",
  };
}
