import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContract } from "../features/contracts/hooks/useContract";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageError } from "../components/ui/PageError";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { initiatePayment } from "../services/paymentService";
import { approveMilestone, disputeMilestone } from "../services/milestoneService";
import type { Milestone } from "../types/contract";

const normalizeStatus = (s: string) => s.toLowerCase();

const ClientViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { contract, status, error, refetch } = useContract(id);

  const [payingMilestoneId, setPayingMilestoneId] = useState<string | null>(null);
  const [actingMilestoneId, setActingMilestoneId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center">
        <LoadingSpinner label="Loading contract..." />
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center px-4">
        <PageError
          variant="not_found"
          message="This contract link is invalid or has expired."
          backTo="/"
          backLabel="Go to homepage"
        />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center px-4">
        <PageError
          variant="network"
          message={error ?? undefined}
          backTo="/"
          backLabel="Go to homepage"
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!contract) return null;

  const handlePay = async (milestone: Milestone) => {
    if (!id) return;
    setPayingMilestoneId(milestone.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      const result = await initiatePayment({
        contractId: id,
        milestoneId: milestone.id,
        amount: milestone.amount,
        email: contract.clientEmail,
        name: "Client",
        currency: "NGN",
      });
      window.location.href = result.paymentLink;
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
      setPayingMilestoneId(null);
    }
  };

  const handleApprove = async (milestone: Milestone) => {
    if (!id) return;
    setActingMilestoneId(milestone.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      await approveMilestone(milestone.id, id);
      setActionSuccess(`Payment for "${milestone.title}" has been released.`);
      refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Approval failed. Please try again."
      );
    } finally {
      setActingMilestoneId(null);
    }
  };

  const handleDispute = async (milestone: Milestone) => {
    if (!id) return;
    setActingMilestoneId(milestone.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      await disputeMilestone(milestone.id, id);
      setActionSuccess(`Dispute raised for "${milestone.title}". Our team will review within 48 hours.`);
      refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to raise dispute. Please try again."
      );
    } finally {
      setActingMilestoneId(null);
    }
  };

  const payableMilestones = contract.milestones.filter(
    (m) => normalizeStatus(m.status) === "pending"
  );

  const awaitingApprovalMilestones = contract.milestones.filter(
    (m) => normalizeStatus(m.status) === "awaiting_approval"
  );

  const releasedAmount = contract.milestones
    .filter((m) => ["released", "RELEASED"].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrow = contract.totalAmount - releasedAmount;

  const sorted = [...contract.milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#0F0F13]">
      <header className="bg-[#1A1A24] border-b border-[#2A2A3A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#4FFFB0] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.3)]">
              <span className="text-[#0F0F13] font-display font-black text-xs">PS</span>
            </div>
            <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0] text-base">
              PaidSafe
            </span>
          </Link>
          <span className="text-[#8888AA]/60 text-xs font-semibold">Secure escrow payments</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F0F0FF]">
                  {contract.title}
                </h1>
                <ContractStatusBadge status={contract.status} />
              </div>
              <p className="text-[#8888AA] text-sm">
                Sent to{" "}
                <span className="font-medium text-[#F0F0FF]">
                  {contract.clientEmail}
                </span>
              </p>
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

        {actionError && (
          <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
        )}

        {actionSuccess && (
          <div className="bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-[#4FFFB0] text-lg leading-none mt-0.5">✓</span>
            <p className="text-[#4FFFB0] text-sm font-medium">{actionSuccess}</p>
          </div>
        )}

        <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-[#2A2A3A]">
            <h2 className="text-[#F0F0FF] font-semibold text-base">Milestones</h2>
          </div>
          <div className="divide-y divide-[#2A2A3A]">
            {sorted.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex items-start gap-4 px-5 py-4 bg-[#1A1A24]"
              >
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
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <ContractStatusBadge status={milestone.status} />
                  <span className="text-[#F0F0FF] text-sm font-semibold tabular-nums">
                    ₦{milestone.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {payableMilestones.length > 0 && (
          <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div>
              <h2 className="text-[#F0F0FF] font-semibold text-base mb-1">
                Pay into escrow
              </h2>
              <p className="text-[#8888AA] text-xs leading-relaxed">
                Funds are held securely and released to the contractor only after you approve their work.
              </p>
            </div>

            <div className="space-y-3">
              {payableMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between gap-4 bg-[#0F0F13] border border-[#2A2A3A] rounded-xl px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F0F0FF] text-sm font-medium truncate">
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="text-[#8888AA] text-xs mt-0.5 truncate">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[#F0F0FF] text-sm font-semibold tabular-nums">
                      ₦{milestone.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePay(milestone)}
                      disabled={payingMilestoneId !== null}
                      className="bg-[#6C63FF] hover:bg-[#5A52E0] disabled:bg-[#6C63FF]/30 disabled:text-[#8888AA] disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(108,99,255,0.3)] flex items-center gap-1.5 cursor-pointer"
                    >
                      {payingMilestoneId === milestone.id ? (
                        <>
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        "Pay into escrow"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#8888AA]/50 text-xs text-center pt-1">
              🔒 Secured by PaidSafe escrow. You stay in control until work is approved.
            </p>
          </div>
        )}

        {awaitingApprovalMilestones.length > 0 && (
          <div className="bg-[#1A1A24] border border-amber-500/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div>
              <h2 className="text-amber-400 font-semibold text-base mb-1">
                Work ready for your review
              </h2>
              <p className="text-[#8888AA] text-xs leading-relaxed">
                The freelancer has marked the following milestones as complete. Review and approve to release payment, or raise a dispute.
              </p>
            </div>

            <div className="space-y-3">
              {awaitingApprovalMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-[#0F0F13] border border-[#2A2A3A] rounded-xl px-4 py-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F0F0FF] text-sm font-medium truncate">
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-[#8888AA] text-xs mt-0.5 truncate">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[#F0F0FF] text-sm font-semibold tabular-nums flex-shrink-0">
                      ₦{milestone.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(milestone)}
                      disabled={actingMilestoneId !== null}
                      className="flex-1 bg-[#4FFFB0]/20 hover:bg-[#4FFFB0]/30 border border-[#4FFFB0]/30 disabled:opacity-50 disabled:cursor-not-allowed text-[#4FFFB0] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {actingMilestoneId === milestone.id ? (
                        <div className="w-3 h-3 border border-[#4FFFB0]/30 border-t-[#4FFFB0] rounded-full animate-spin" />
                      ) : (
                        "✓ Approve & release payment"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDispute(milestone)}
                      disabled={actingMilestoneId !== null}
                      className="flex-1 bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/20 border border-[#FF4D4D]/20 disabled:opacity-50 disabled:cursor-not-allowed text-[#FF4D4D] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Raise a dispute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {payableMilestones.length === 0 &&
          awaitingApprovalMilestones.length === 0 &&
          contract.milestones.every(
            (m) =>
              ["released", "RELEASED", "disputed", "DISPUTED"].includes(m.status)
          ) && (
            <div className="bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 rounded-2xl p-5 text-center shadow-xl">
              <p className="text-[#4FFFB0] font-semibold text-sm mb-1">
                All milestones settled
              </p>
              <p className="text-[#8888AA] text-xs">
                All milestones have been released or resolved.
              </p>
            </div>
          )}
      </main>
    </div>
  );
};

export default ClientViewPage;