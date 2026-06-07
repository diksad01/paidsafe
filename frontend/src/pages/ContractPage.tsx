import { useParams, Link } from "react-router-dom";
import { useContract } from "../features/contracts/hooks/useContract";
import { MilestoneList } from "../features/contracts/components/MilestoneList";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PageError } from "../components/ui/PageError";

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const { contract, status, error, refetch } = useContract(id);

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

  const releasedAmount = contract.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrow = contract.totalAmount - releasedAmount;

  const clientViewUrl = `${window.location.origin}/contract/${contract.id}/client`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link
          to="/dashboard"
          className="hover:text-slate-700 transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-600 truncate">{contract.title}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {contract.title}
              </h1>
              <ContractStatusBadge status={contract.status} />
            </div>
            <p className="text-slate-500 text-sm">{contract.clientEmail}</p>
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

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-900 font-semibold text-base">
            Milestones
          </h2>
        </div>
        <MilestoneList milestones={contract.milestones} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <p className="text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
          Client payment link
        </p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={clientViewUrl}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(clientViewUrl)}
            className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Request approval
        </button>
        <button
          type="button"
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Message client
        </button>
      </div>
    </div>
  );
};

export default ContractPage;