export interface AIMilestoneRequest {
  description: string;
}

export interface AISuggestedMilestone {
  title: string;
  amount: number;
}

export interface AIMilestoneResponse {
  milestones: AISuggestedMilestone[];
}

export interface AIServiceError {
  code: "NETWORK_ERROR" | "PARSE_ERROR" | "SERVICE_UNAVAILABLE" | "INVALID_RESPONSE";
  message: string;
}