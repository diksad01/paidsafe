import { Link } from "react-router-dom";
import { useContracts } from "../hooks/useContracts";
import { useAuthStore } from "../store/authStore";
import { ContractStats } from "../features/contracts/components/ContractStats";
import { ContractStatusBadge } from "../features/contracts/components/ContractStatusBadge";
import { EmptyContracts } from "../features/contracts/components/EmptyContracts";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorBanner } from "../components/ui/ErrorBanner";

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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Contract
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={refetch} />
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
              <Link
                key={contract.id}
                to={`/contract/${contract.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-[#2A2A3A] transition-all duration-200 group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-9 h-9 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#6C63FF] text-xs font-bold font-display">
                      {contract.clientEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#F0F0FF] font-medium text-sm group-hover:text-[#6C63FF] transition-colors">
                      {contract.title}
                    </p>
                    <p className="text-[#8888AA] text-xs mt-0.5">
                      {contract.clientEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-0">
                  <ContractStatusBadge status={contract.status} />
                  <span className="text-[#F0F0FF] font-semibold text-sm tabular-nums ml-auto sm:ml-0">
                    ₦{contract.totalAmount.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;