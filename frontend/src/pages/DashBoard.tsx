import { useState } from "react";
import { Link } from "react-router-dom";
import { useContracts } from "../hooks/useContracts";
import { useAuthStore } from "../store/authStore";
import { ContractStats } from "../features/contracts/components/ContractStats";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { EmptyContracts } from "../features/contracts/components/EmptyContracts";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { deleteContract } from "../services/contractService";
import { auth } from "../lib/firebase";

interface ContractItem {
  id: string;
  title: string;
  clientEmail: string;
  status: any;
  totalAmount: number;
}

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { contracts, stats, loading, error, refetch } = useContracts(
    user?.uid ?? ""
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const contractToDelete = contracts.find(
    (c: ContractItem) => c.id === confirmDeleteId
  );

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");
      await deleteContract(confirmDeleteId, token);
      setConfirmDeleteId(null);
      refetch();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete contract."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F0F0FF]">
            Dashboard
          </h1>
          <p className="text-[#8888AA] text-sm mt-1">
            Manage your contracts and payments
          </p>
        </div>
        <Link
          to="/contract/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Contract
        </Link>
      </div>

      {(error || deleteError) && (
        <div className="mb-6">
          <ErrorBanner
            message={error ?? deleteError ?? ""}
            onRetry={error ? refetch : undefined}
            onDismiss={deleteError ? () => setDeleteError(null) : undefined}
          />
        </div>
      )}

      <div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i: number) => (
              <div
                key={i}
                className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-4 sm:p-5 h-24 animate-pulse"
              >
                <div className="h-3 bg-[#2A2A3A] rounded w-2/3 mb-3" />
                <div className="h-6 bg-[#2A2A3A] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ContractStats stats={stats} />
        )}
      </div>

      <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-[#2A2A3A] flex items-center justify-between">
          <h2 className="text-[#F0F0FF] font-semibold text-base">
            Recent Contracts
          </h2>
          {!loading && (
            <span className="text-[#8888AA] text-xs">
              {contracts.length} total
            </span>
          )}
        </div>

        {loading && (
          <div className="py-16">
            <LoadingSpinner label="Loading contracts..." />
          </div>
        )}

        {!loading && contracts.length === 0 && <EmptyContracts />}

        {!loading && contracts.length > 0 && (
          <div className="divide-y divide-[#2A2A3A]">
            {contracts.map((contract: ContractItem) => (
              <div
                key={contract.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-[#2A2A3A]/50 transition-all duration-200 group"
              >
                <Link
                  to={`/contract/${contract.id}`}
                  className="flex items-start sm:items-center gap-4 flex-1 min-w-0"
                >
                  <div className="w-9 h-9 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#6C63FF] text-xs font-bold font-display">
                      {contract.clientEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#F0F0FF] font-medium text-sm group-hover:text-[#6C63FF] transition-colors truncate">
                      {contract.title}
                    </p>
                    <p className="text-[#8888AA] text-xs mt-0.5 truncate">
                      {contract.clientEmail}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <ContractStatusBadge status={contract.status} />
                  <span className="text-[#F0F0FF] font-semibold text-sm tabular-nums">
                    ₦{contract.totalAmount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(contract.id);
                    }}
                    title="Delete contract"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#8888AA] hover:text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDeleteId && contractToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A24] border border-[#FF4D4D]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-[#FF4D4D]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FF4D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-[#F0F0FF] font-bold text-lg mb-1">Delete contract?</h3>
            <p className="text-[#8888AA] text-sm mb-6">
              This will permanently delete{" "}
              <span className="text-[#F0F0FF] font-medium">{contractToDelete.title}</span>{" "}
              and all its milestones. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1 bg-[#2A2A3A] hover:bg-[#3A3A4A] disabled:opacity-50 text-[#F0F0FF] text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-[#FF4D4D] hover:bg-[#E03E3E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;