import { useState, useEffect, useCallback } from "react";
import {
  getContractsByOwner,
  computeDashboardStats,
} from "../services/contractService";
import type { Contract, DashboardStats } from "../types/contract";

interface UseContractsResult {
  contracts: Contract[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useContracts = (uid: string): UseContractsResult => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalContracts: 0,
    inEscrow: 0,
    released: 0,
    pendingApproval: 0,
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getContractsByOwner(uid);
        if (cancelled) return;
        setContracts(data);
        setStats(computeDashboardStats(data));
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load contracts. Please try again.";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [uid, tick]);

  return { contracts, stats, loading, error, refetch };
};
