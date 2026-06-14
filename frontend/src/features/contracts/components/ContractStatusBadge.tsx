import type { ContractStatus, MilestoneStatus } from "../../../types/contract";

type BadgeStatus =
  | ContractStatus
  | MilestoneStatus
  | "pending_client"
  | "funded";

interface ContractStatusBadgeProps {
  status: BadgeStatus | string;
}

const styleMap: Record<string, string> = {
  draft: "bg-[#8888AA]/10 text-[#8888AA] border-[#8888AA]/20",
  active: "bg-[#6C63FF]/20 text-[#6C63FF] border-[#6C63FF]/30",
  completed: "bg-[#4FFFB0]/20 text-[#4FFFB0] border-[#4FFFB0]/30",
  disputed: "bg-[#FF4D4D]/20 text-[#FF4D4D] border-[#FF4D4D]/30",
  pending: "bg-[#8888AA]/10 text-[#8888AA] border-[#8888AA]/20",
  pending_client: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  pending_client_upper: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  in_review: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  released: "bg-[#4FFFB0]/20 text-[#4FFFB0] border-[#4FFFB0]/30",
  funded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  awaiting_approval: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const labelMap: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  disputed: "Disputed",
  pending: "Pending",
  pending_client: "Pending Client",
  in_review: "In Review",
  released: "Released",
  funded: "Funded",
  awaiting_approval: "Awaiting Approval",
};

export const ContractStatusBadge = ({
  status,
}: ContractStatusBadgeProps) => {
  const normalized = status
    ? status.toLowerCase().replace(/ /g, "_")
    : "pending";
  const style = styleMap[normalized] ?? styleMap.pending;
  const label = labelMap[normalized] ?? String(status);

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${style}`}
    >
      {label}
    </span>
  );
};