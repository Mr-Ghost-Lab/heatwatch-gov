import { USE_MOCK_DATA, apiRequest, mockDelay } from "./client";
import { MOCK_ACTIONS } from "@/mocks/thermoshield";
import type { ActionStatus, ActionWindow, InterventionAction } from "@/types";

export interface CreateActionPayload {
  title: string;
  window: ActionWindow;
  wardId: string;
  location: string;
  responsibleOfficer: string;
  deadline: string;
  notes?: string;
}

// Prototype-only in-memory store.
let mockActions: InterventionAction[] = MOCK_ACTIONS.map((a) => ({ ...a }));

export const actionsApi = {
  /** GET /actions */
  list(): Promise<InterventionAction[]> {
    if (USE_MOCK_DATA) return mockDelay(mockActions.map((a) => ({ ...a })), 300);
    return apiRequest<InterventionAction[]>("/actions");
  },

  /** POST /actions */
  create(payload: CreateActionPayload): Promise<InterventionAction> {
    if (USE_MOCK_DATA) {
      const created: InterventionAction = {
        id: `ACT-${5100 + mockActions.length}`,
        status: "PENDING",
        ...payload,
      };
      mockActions = [created, ...mockActions];
      return mockDelay({ ...created }, 300);
    }
    return apiRequest<InterventionAction>("/actions", { method: "POST", body: payload });
  },

  /** PATCH /actions/{actionId} */
  update(actionId: string, patch: { status?: ActionStatus; responsibleOfficer?: string; notes?: string }): Promise<InterventionAction> {
    if (USE_MOCK_DATA) {
      mockActions = mockActions.map((a) => (a.id === actionId ? { ...a, ...patch } : a));
      const updated = mockActions.find((a) => a.id === actionId);
      if (!updated) return Promise.reject(new Error(`Action ${actionId} not found.`));
      return mockDelay({ ...updated }, 240);
    }
    return apiRequest<InterventionAction>(`/actions/${encodeURIComponent(actionId)}`, {
      method: "PATCH",
      body: patch,
    });
  },
};
