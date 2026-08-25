import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_REPORTS } from "@/mocks/thermoshield";
import type { ReportDefinition } from "@/types";

export interface GenerateReportPayload {
  reportId: string;
  wardId?: string;
  period?: string;
}

export interface GenerateReportResponse {
  reportId: string;
  status: ReportDefinition["status"];
  downloadUrl: string | null;
  message: string;
}

let mockReports: ReportDefinition[] = MOCK_REPORTS.map((r) => ({ ...r }));

export const reportsApi = {
  /** GET /reports */
  list(): Promise<ReportDefinition[]> {
    if (USE_MOCK_DATA) return mockDelay(mockReports.map((r) => ({ ...r })), 260);
    return apiRequest<ReportDefinition[]>("/reports");
  },

  /**
   * POST /reports/generate
   * Document rendering is performed by FastAPI (Celery worker). In prototype mode the
   * request is acknowledged but no document is produced — nothing is faked.
   */
  generate(payload: GenerateReportPayload): Promise<GenerateReportResponse> {
    if (USE_MOCK_DATA) {
      mockReports = mockReports.map((r) => (r.id === payload.reportId ? { ...r, status: "GENERATING" } : r));
      return mockDelay({
        reportId: payload.reportId,
        status: "GENERATING" as const,
        downloadUrl: null,
        message:
          "Report generation is handled by the FastAPI reporting service (Celery). Prototype mode cannot produce a document — enable the backend to receive a downloadable file.",
      });
    }
    return apiRequest<GenerateReportResponse>("/reports/generate", { method: "POST", body: payload });
  },
};
