import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContract } from "../features/contracts/hooks/useContract";
import { MilestoneList } from "../features/contracts/components/MilestoneList";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageError } from "../components/ui/PageError";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { updateMilestoneStatus } from "../services/contractService";
import type { Milestone } from "../types/contract";

const ClientViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { contract, status, error, refetch } = useContract(id);

  const [payingMilestoneId, setPayingMilestoneId] = useState<string | null>(
    null
  );
  const [payError, setPayError] = useState<string | null>(null);
  const [paidMilestoneIds, setPaidMilestoneIds] = useState<Set<string>>(
    new Set()
  );

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner label="Loading contract..." />
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
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
    setPayError(null);

    try {
      await updateMilestoneStatus(
        id,
        milestone.id,
        "in_review"
      );

      setPaidMilestoneIds((prev) => new Set(prev).add(milestone.id));
      refetch();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setPayError(message);
    } finally {
      setPayingMilestoneId(null);
    }
  };

  const payableMilestones = contract.milestones.filter(
    (m) => m.status === "pending" && !paidMilestoneIds.has(m.id)
  );

  const releasedAmount = contract.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrow = contract.totalAmount - releasedAmount;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">PS</span>
            </div>
            <span className="text-slate-900 font-semibold text-base">
              PaidSafe
            </span>
          </Link>
          <span className="text-slate-400 text-xs">Secure escrow payments</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {contract.title}
                </h1>
                <ContractStatusBadge status={contract.status} />
              </div>
              <p className="text-slate-500 text-sm">
                Sent to{" "}
                <span className="font-medium text-slate-700">
                  {contract.clientEmail}
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                ${contract.totalAmount.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">total value</p>
            </div>
          </div>

          {contract.description && (
            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              {contract.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">In escrow</p>
              <p className="text-slate-900 font-bold text-lg tabular-nums">
                ${inEscrow.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-emerald-600 text-xs mb-1">Released</p>
              <p className="text-emerald-700 font-bold text-lg tabular-nums">
                ${releasedAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {payError && (
          <ErrorBanner
            message={payError}
            onDismiss={() => setPayError(null)}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-slate-900 font-semibold text-base">
              Milestones
            </h2>
          </div>
          <MilestoneList milestones={contract.milestones} />
        </div>

        {payableMilestones.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-slate-900 font-semibold text-base mb-1">
                Pay a milestone
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Funds are held in escrow and released to the contractor only
                after you approve the delivered work.
              </p>
            </div>

            <div className="space-y-3">
              {payableMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between gap-4 bg-slate-50 rounded-xl px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-medium truncate">
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="text-slate-400 text-xs mt-0.5 truncate">
                        {milestone.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-900 text-sm font-semibold tabular-nums">
                      ${milestone.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePay(milestone)}
                      disabled={payingMilestoneId !== null}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {payingMilestoneId === milestone.id ? (
                        <>
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Pay now"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-slate-400 text-xs text-center pt-1">
              🔒 Payments are secured by PaidSafe escrow. You stay in control
              until work is approved.
            </p>
          </div>
        )}

        {payableMilestones.length === 0 &&
          contract.milestones.every(
            (m) => m.status === "released" || m.status === "in_review"
          ) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
              <p className="text-emerald-700 font-semibold text-sm mb-1">
                All milestones funded
              </p>
              <p className="text-emerald-600 text-xs">
                All milestones have been paid or are currently in review.
              </p>
            </div>
          )}
      </main>
    </div>
  );
};

export default ClientViewPage;