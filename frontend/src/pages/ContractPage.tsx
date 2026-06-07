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
      <div className="flex items-center gap-2 text-sm text-[#8888AA] mb-6">
        <Link
          to="/dashboard"
          className="hover:text-[#F0F0FF] transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#8888AA]/60 truncate">{contract.title}</span>
      </div>

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

      <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl overflow-hidden mb-5 shadow-xl">
        <div className="px-5 py-4 border-b border-[#2A2A3A]">
          <h2 className="text-[#F0F0FF] font-semibold text-base">
            Milestones
          </h2>
        </div>
        <MilestoneList milestones={contract.milestones} />
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

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="flex-1 bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_25px_rgba(108,99,255,0.4)] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
        >
          Request approval
        </button>
        <button
          type="button"
          className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] hover:bg-[#2A2A3A] hover:text-[#F0F0FF] text-[#8888AA] font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
        >
          Message client
        </button>
      </div>
    </div>
  );
};

export default ContractPage;