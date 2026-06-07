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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your contracts and payments
          </p>
        </div>
        <Link
          to="/contract/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
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

      <div className="mb-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i: number) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 h-20 animate-pulse"
              >
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
                <div className="h-6 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ContractStats stats={stats} />
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-slate-900 font-semibold text-base">
            Recent Contracts
          </h2>
          {!loading && (
            <span className="text-slate-400 text-xs">
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
          <div className="divide-y divide-slate-100">
            {contracts.map((contract: ContractItem) => (
              <Link
                key={contract.id}
                to={`/contract/${contract.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-xs font-bold">
                      {contract.clientEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium text-sm group-hover:text-indigo-600 transition-colors">
                      {contract.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {contract.clientEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-0">
                  <ContractStatusBadge status={contract.status} />
                  <span className="text-slate-900 font-semibold text-sm tabular-nums ml-auto sm:ml-0">
                    ${contract.totalAmount.toLocaleString()}
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