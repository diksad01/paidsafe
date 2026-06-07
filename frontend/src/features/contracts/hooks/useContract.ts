import { useState, useEffect, useCallback } from "react";
import { getContractById } from "../../../services/contractService";
import type { Contract } from "../../../types/contract";

type FetchStatus = "idle" | "loading" | "success" | "not_found" | "error";

interface UseContractResult {
  contract: Contract | null;
  status: FetchStatus;
  error: string | null;
  refetch: () => void;
}

export const useContract = (id: string | undefined): UseContractResult => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) {
      setStatus("not_found");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      setError(null);

      try {
        const data = await getContractById(id);

        if (cancelled) return;

        if (!data) {
          setStatus("not_found");
          return;
        }

        setContract(data);
        setStatus("success");
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Failed to load contract. Please try again.";

        setError(message);
        setStatus("error");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  return { contract, status, error, refetch };
};