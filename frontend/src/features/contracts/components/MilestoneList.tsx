import type { Milestone } from "../../../types/contract";
import { ContractStatusBadge } from "./ContractStatusBadge";

interface MilestoneListProps {
  milestones: Milestone[];
}

export const MilestoneList = ({ milestones }: MilestoneListProps) => {
  if (milestones.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-slate-400 text-sm">No milestones defined.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {milestones
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((milestone, index) => (
          <div
            key={milestone.id}
            className="flex items-start gap-4 px-5 py-4"
          >
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-600 text-xs font-bold">
                {index + 1}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-sm font-medium">
                {milestone.title}
              </p>
              {milestone.description && (
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                  {milestone.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <ContractStatusBadge status={milestone.status} />
              <span className="text-slate-900 text-sm font-semibold tabular-nums">
                ${milestone.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};