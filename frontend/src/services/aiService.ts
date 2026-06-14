import type {
  AIMilestoneRequest,
  AIMilestoneResponse,
  AIServiceError,
} from "../types/ai";

const AI_ENDPOINT =
  import.meta.env.VITE_AI_ENDPOINT ?? "https://paidsafe.up.railway.app/api/contracts/draft";

class AIError extends Error {
  readonly code: AIServiceError["code"];

  constructor(code: AIServiceError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "AIError";
  }
}

export const generateMilestones = async (
  request: AIMilestoneRequest
): Promise<AIMilestoneResponse> => {
  let response: Response;

  try {
    response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: request.description }),
    });
  } catch {
    throw new AIError(
      "NETWORK_ERROR",
      "Could not reach the AI service. Please check your connection."
    );
  }

  if (response.status === 503 || response.status === 502) {
    throw new AIError(
      "SERVICE_UNAVAILABLE",
      "The AI service is temporarily unavailable. You can add milestones manually."
    );
  }

  if (!response.ok) {
    throw new AIError(
      "SERVICE_UNAVAILABLE",
      `AI service returned an unexpected error (${response.status}).`
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new AIError(
      "PARSE_ERROR",
      "The AI service returned an unreadable response."
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("milestones" in data) ||
    !Array.isArray((data as Record<string, unknown>).milestones)
  ) {
    throw new AIError(
      "INVALID_RESPONSE",
      "The AI service returned an unexpected response shape."
    );
  }

  return data as AIMilestoneResponse;
};

export const isAIError = (error: unknown): error is AIError =>
  error instanceof AIError;