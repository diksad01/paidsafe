const API_BASE =
  import.meta.env.VITE_BACKEND_URL ??
  "https://paidsafe.up.railway.app";

export interface InitiatePaymentInput {
  contractId: string;
  milestoneId: string;
  amount: number;
  email: string;
  name?: string;
  currency?: string;
}

export interface InitiatePaymentResult {
  paymentLink: string;
}

export const initiatePayment = async (
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> => {
  const response = await fetch(`${API_BASE}/api/payments/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contractId: input.contractId,
      milestoneId: input.milestoneId,
      amount: input.amount,
      email: input.email,
      name: input.name ?? input.email,
      currency: input.currency ?? "NGN",
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Payment initiation failed (${response.status})`
    );
  }

  return response.json() as Promise<InitiatePaymentResult>;
};
