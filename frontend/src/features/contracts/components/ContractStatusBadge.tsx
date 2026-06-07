import type { ContractStatus, MilestoneStatus } from "../../../types/contract";

type BadgeStatus = ContractStatus | MilestoneStatus;

interface ContractStatusBadgeProps {
  status: BadgeStatus;
}

const styleMap: Record<BadgeStatus, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  disputed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_review: "bg-blue-50 text-blue-700 border-blue-200",
  released: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const labelMap: Record<BadgeStatus, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  disputed: "Disputed",
  pending: "Pending",
  in_review: "In Review",
  released: "Released",
};

export const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => (
  <span
    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${styleMap[status]}`}
  >
    {labelMap[status]}
  </span>
);