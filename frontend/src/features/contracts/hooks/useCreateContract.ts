import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { createContract } from "../../../services/contractService";
import { generateMilestones, isAIError } from "../../../services/aiService";
import type { CreateContractInput, Milestone } from "../../../types/contract";

type MilestoneInput = Omit<Milestone, "id" | "status">;

interface UseCreateContractResult {
  milestones: MilestoneInput[];
  aiLoading: boolean;
  aiError: string | null;
  saveLoading: boolean;
  saveError: string | null;
  suggestMilestones: (description: string) => Promise<void>;
  setMilestones: React.Dispatch<React.SetStateAction<MilestoneInput[]>>;
  clearAiError: () => void;
  submitContract: (input: CreateContractInput) => Promise<void>;
}

const DEFAULT_MILESTONE: MilestoneInput = {
  title: "",
  description: "",
  amount: 0,
  order: 0,
};

export const useCreateContract = (): UseCreateContractResult => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { ...DEFAULT_MILESTONE },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const clearAiError = useCallback(() => setAiError(null), []);

  const suggestMilestones = useCallback(
    async (description: string): Promise<void> => {
      setAiLoading(true);
      setAiError(null);

      try {
        const response = await generateMilestones({ description });

        setMilestones(
          response.milestones.map((m, i) => ({
            title: m.title,
            description: "",
            amount: m.amount,
            order: i,
          }))
        );
      } catch (err) {
        const message = isAIError(err)
          ? err.message
          : "Failed to generate milestones. You can add them manually.";
        setAiError(message);
      } finally {
        setAiLoading(false);
      }
    },
    []
  );

  const submitContract = useCallback(
    async (input: CreateContractInput): Promise<void> => {
      if (!user) {
        setSaveError("You must be signed in to create a contract.");
        return;
      }

      setSaveLoading(true);
      setSaveError(null);

      try {
        const contractId = await createContract(user.uid, {
          ...input,
          milestones,
        });
        navigate(`/contract/${contractId}`);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to save contract. Please try again.";
        setSaveError(message);
      } finally {
        setSaveLoading(false);
      }
    },
    [user, milestones, navigate]
  );

  return {
    milestones,
    aiLoading,
    aiError,
    saveLoading,
    saveError,
    suggestMilestones,
    setMilestones,
    clearAiError,
    submitContract,
  };
};