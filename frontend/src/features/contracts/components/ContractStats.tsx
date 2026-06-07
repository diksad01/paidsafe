import type { DashboardStats } from "../../../types/contract";

interface ContractStatsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
    <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
    <p className="text-slate-900 text-xl sm:text-2xl font-bold tabular-nums">
      {value}
    </p>
  </div>
);

export const ContractStats = ({ stats }: ContractStatsProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <StatCard
      label="Total Contracts"
      value={stats.totalContracts.toString()}
    />
    <StatCard
      label="In Escrow"
      value={`$${stats.inEscrow.toLocaleString()}`}
    />
    <StatCard
      label="Released"
      value={`$${stats.released.toLocaleString()}`}
    />
    <StatCard
      label="Pending Approval"
      value={stats.pendingApproval.toString()}
    />
  </div>
);