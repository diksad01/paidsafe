import { auth } from "../lib/firebase";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ??
  "https://paidsafe.up.railway.app";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return { "Content-Type": "application/json" };
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const patchMilestone = async (
  milestoneId: string,
  action: "complete" | "approve" | "dispute",
  contractId: string
): Promise<void> => {
  const headers =
    action === "complete" ? await getAuthHeaders() : { "Content-Type": "application/json" };

  const response = await fetch(
    `${API_BASE}/api/milestones/${milestoneId}/${action}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ contractId }),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ??
        `Failed to ${action} milestone (${response.status})`
    );
  }
};

export const completeMilestone = (
  milestoneId: string,
  contractId: string
): Promise<void> => patchMilestone(milestoneId, "complete", contractId);

export const approveMilestone = (
  milestoneId: string,
  contractId: string
): Promise<void> => patchMilestone(milestoneId, "approve", contractId);

export const disputeMilestone = (
  milestoneId: string,
  contractId: string
): Promise<void> => patchMilestone(milestoneId, "dispute", contractId);
