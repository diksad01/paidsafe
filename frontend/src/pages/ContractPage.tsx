import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useContract } from "../features/contracts/hooks/useContract";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageError } from "../components/ui/PageError";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { completeMilestone } from "../services/milestoneService";
import { deleteContract } from "../services/contractService";
import { auth } from "../lib/firebase";
import type { Milestone } from "../types/contract";

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contract, status, error, refetch } = useContract(id);

  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [completeSuccess, setCompleteSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");
      await deleteContract(id, token);
      navigate("/dashboard");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete contract.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="py-24">
        <LoadingSpinner label="Loading contract..." />
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <PageError
        variant="not_found"
        message="This contract doesn't exist or has been removed."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />
    );
  }

  if (status === "error") {
    return (
      <PageError
        variant="network"
        message={error ?? undefined}
        backTo="/dashboard"
        backLabel="Back to dashboard"
        onRetry={refetch}
      />
    );
  }

  if (!contract) return null;

  const handleComplete = async (milestone: Milestone) => {
    if (!id) return;
    setCompletingId(milestone.id);
    setCompleteError(null);
    setCompleteSuccess(null);
    try {
      await completeMilestone(milestone.id, id);
      setCompleteSuccess(`"${milestone.title}" marked as complete. Your client has been notified.`);
      refetch();
    } catch (err) {
      setCompleteError(
        err instanceof Error ? err.message : "Failed to mark milestone as complete."
      );
    } finally {
      setCompletingId(null);
    }
  };

  const releasedAmount = contract.milestones
    .filter((m) => ["released", "RELEASED"].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrow = contract.totalAmount - releasedAmount;

  const clientViewUrl = `${window.location.origin}/contract/${contract.id}/client`;

  const sorted = [...contract.milestones].sort((a, b) => a.order - b.order);
  const isFunded = (s: string) => s.toUpperCase() === "FUNDED";
  const isAwaitingApproval = (s: string) => s.toUpperCase() === "AWAITING_APPROVAL";
  const isReleased = (s: string) =>
    ["RELEASED", "released"].includes(s);
  const isDisputed = (s: string) => s.toUpperCase() === "DISPUTED";

  return (
    <div className="max-w-2xl mx-auto">
      {deleteError && (
        <div className="mb-4">
          <ErrorBanner message={deleteError} onDismiss={() => setDeleteError(null)} />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-sm text-[#8888AA] mb-6">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="hover:text-[#F0F0FF] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#8888AA]/60 truncate">{contract.title}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete contract"
          className="flex items-center gap-1.5 text-[#8888AA] hover:text-[#FF4D4D] text-xs font-medium transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-[#FF4D4D]/10"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A24] border border-[#FF4D4D]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-[#FF4D4D]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FF4D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-[#F0F0FF] font-bold text-lg mb-1">Delete contract?</h3>
            <p className="text-[#8888AA] text-sm mb-6">
              This will permanently delete <span className="text-[#F0F0FF] font-medium">{contract.title}</span> and all its milestones. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
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

      <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-5 sm:p-6 mb-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F0F0FF]">
                {contract.title}
              </h1>
              <ContractStatusBadge status={contract.status} />
            </div>
            <p className="text-[#8888AA] text-sm">{contract.clientEmail}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-2xl font-bold text-[#F0F0FF] tabular-nums">
              ₦{contract.totalAmount.toLocaleString()}
            </p>
            <p className="text-[#8888AA]/60 text-xs mt-0.5">total value</p>
          </div>
        </div>

        {contract.description && (
          <p className="text-[#8888AA] text-sm mt-4 leading-relaxed">
            {contract.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[#2A2A3A]">
          <div className="bg-[#0F0F13] border border-[#2A2A3A] rounded-xl p-4">
            <p className="text-[#8888AA] text-xs mb-1">In escrow</p>
            <p className="text-[#F0F0FF] font-bold text-lg tabular-nums">
              ₦{inEscrow.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#0F0F13] border border-[#2A2A3A] rounded-xl p-4">
            <p className="text-[#4FFFB0]/80 text-xs mb-1">Released</p>
            <p className="text-[#4FFFB0] font-bold text-lg tabular-nums">
              ₦{releasedAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {completeError && (
        <div className="mb-5">
          <ErrorBanner message={completeError} onDismiss={() => setCompleteError(null)} />
        </div>
      )}

      {completeSuccess && (
        <div className="mb-5 bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-[#4FFFB0] text-lg leading-none mt-0.5">✓</span>
          <p className="text-[#4FFFB0] text-sm font-medium">{completeSuccess}</p>
        </div>
      )}

      <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl overflow-hidden mb-5 shadow-xl">
        <div className="px-5 py-4 border-b border-[#2A2A3A]">
          <h2 className="text-[#F0F0FF] font-semibold text-base">Milestones</h2>
        </div>
        <div className="divide-y divide-[#2A2A3A]">
          {sorted.map((milestone, index) => (
            <div
              key={milestone.id}
              className="px-5 py-4 bg-[#1A1A24]"
            >
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#6C63FF] text-xs font-bold">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#F0F0FF] text-sm font-medium">{milestone.title}</p>
                  {milestone.description && (
                    <p className="text-[#8888AA] text-xs mt-0.5 leading-relaxed">
                      {milestone.description}
                    </p>
                  )}

                  {isFunded(milestone.status) && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => handleComplete(milestone)}
                        disabled={completingId !== null}
                        className="inline-flex items-center gap-1.5 bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_15px_rgba(108,99,255,0.3)] disabled:bg-[#6C63FF]/30 disabled:text-[#8888AA] disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        {completingId === milestone.id ? (
                          <>
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Mark as complete"
                        )}
                      </button>
                    </div>
                  )}

                  {isAwaitingApproval(milestone.status) && (
                    <p className="mt-2 text-amber-400 text-xs font-medium">
                      ⏳ Waiting for client approval
                    </p>
                  )}

                  {isReleased(milestone.status) && (
                    <p className="mt-2 text-[#4FFFB0] text-xs font-medium">
                      ✓ Payment released
                    </p>
                  )}

                  {isDisputed(milestone.status) && (
                    <p className="mt-2 text-[#FF4D4D] text-xs font-medium">
                      ⚠ Under dispute — our team is reviewing
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <ContractStatusBadge status={milestone.status} />
                  <span className="text-[#F0F0FF] text-sm font-semibold tabular-nums">
                    ₦{milestone.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-5 mb-5 shadow-xl">
        <p className="text-[#8888AA] text-xs font-semibold uppercase tracking-wide mb-2">
          Client payment link
        </p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={clientViewUrl}
            className="flex-1 bg-[#0F0F13] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-xs text-[#8888AA] font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(clientViewUrl)}
            className="flex-shrink-0 bg-[#1A1A24] border border-[#2A2A3A] hover:bg-[#2A2A3A] text-[#F0F0FF] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(108,99,255,0.2)] cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;