import type { UserRole } from "@/types";

export interface NavItem {
  to: string;
  label: string;
  group: "Situation" | "Assessment" | "Response" | "Administration";
  roles: UserRole[];
}

const ALL: UserRole[] = [
  "MUNICIPAL_AUTHORITY",
  "DISASTER_MANAGEMENT_OFFICER",
  "HEALTHCARE_AUTHORITY",
  "FIELD_OFFICER",
  "CITIZEN",
];

const OFFICIAL: UserRole[] = [
  "MUNICIPAL_AUTHORITY",
  "DISASTER_MANAGEMENT_OFFICER",
  "HEALTHCARE_AUTHORITY",
  "FIELD_OFFICER",
];

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", group: "Situation", roles: ALL },
  { to: "/risk-map", label: "Heat Risk Map", group: "Situation", roles: ALL },
  { to: "/forecast", label: "Forecast", group: "Situation", roles: ALL },
  { to: "/health-metric", label: "Health Metric", group: "Assessment", roles: ["CITIZEN"] },
  { to: "/thermal-stress", label: "Thermal Stress", group: "Assessment", roles: OFFICIAL },
  { to: "/health-risk", label: "Health Impact", group: "Assessment", roles: OFFICIAL },
  { to: "/population", label: "Vulnerable Population", group: "Assessment", roles: OFFICIAL },
  { to: "/alerts", label: "Alerts", group: "Response", roles: ALL },
  {
    to: "/recommended-actions",
    label: "Recommended Actions",
    group: "Response",
    roles: OFFICIAL,
  },
  {
    to: "/analytics",
    label: "Analytics",
    group: "Administration",
    roles: ["MUNICIPAL_AUTHORITY", "DISASTER_MANAGEMENT_OFFICER", "HEALTHCARE_AUTHORITY"],
  },
  {
    to: "/reports",
    label: "Reports",
    group: "Administration",
    roles: ["MUNICIPAL_AUTHORITY", "DISASTER_MANAGEMENT_OFFICER", "HEALTHCARE_AUTHORITY"],
  },
  { to: "/system-status", label: "System Status", group: "Administration", roles: OFFICIAL },
  { to: "/settings", label: "Settings", group: "Administration", roles: ALL },
];

export const NAV_GROUPS = ["Situation", "Assessment", "Response", "Administration"] as const;

export function canAccess(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  const item = NAV_ITEMS.find((n) => n.to === path);
  if (!item) return true;
  return item.roles.includes(role);
}
