import { useParams, Link } from "react-router-dom";

type ContractStatus = "active" | "pending" | "completed";
type MilestoneStatus = "pending" | "in_review" | "released";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
}

interface ContractData {
  id: string;
  title: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: ContractStatus;
  description: string;
  milestones: Milestone[];
}

const mockContracts: Record<string, ContractData> = {
  "c-001": {
    id: "c-001",
    title: "Brand Identity Design",
    client: "Acme Corp",
    clientEmail: "hello@acme.com",
    amount: 2400,
    status: "active",
    description:
      "Complete brand identity including logo, color palette, typography system, and brand guidelines document.",
    milestones: [
      { id: "m1", title: "Logo concepts (3 options)", amount: 800, status: "released" },
      { id: "m2", title: "Final logo + brand kit", amount: 900, status: "in_review" },
      { id: "m3", title: "Brand guidelines PDF", amount: 700, status: "pending" },
    ],
  },
  "c-002": {
    id: "c-002",
    title: "Mobile App MVP",
    client: "Stark Industries",
    clientEmail: "projects@stark.io",
    amount: 8000,
    status: "pending",
    description:
      "React Native mobile app with authentication, home dashboard, and core feature set as per specification.",
    milestones: [
      { id: "m1", title: "UI/UX wireframes", amount: 1500, status: "pending" },
      { id: "m2", title: "Frontend build", amount: 4000, status: "pending" },
      { id: "m3", title: "Backend API integration", amount: 2500, status: "pending" },
    ],
  },
};

const milestoneStatusStyles: Record<MilestoneStatus, string> = {
  pending: "bg-slate-100 text-slate-500 border-slate-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  released: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const milestoneStatusLabel: Record<MilestoneStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  released: "Released",
};

const contractStatusStyles: Record<ContractStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const contract = id ? mockContracts[id] : null;

  if (!contract) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-400 text-2xl">?</span>
        </div>
        <h2 className="text-slate-900 font-bold text-xl mb-2">Contract not found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The contract you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const releasedAmount = contract.milestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrow = contract.amount - releasedAmount;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/dashboard" className="hover:text-slate-700 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-600">{contract.title}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {contract.title}
              </h1>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${contractStatusStyles[contract.status]}`}
              >
                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-500 text-sm">{contract.clientEmail}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-slate-900">
              ${contract.amount.toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">total value</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm mt-4 leading-relaxed">
          {contract.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">In escrow</p>
            <p className="text-slate-900 font-bold text-lg">
              ${inEscrow.toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-emerald-600 text-xs mb-1">Released</p>
            <p className="text-emerald-700 font-bold text-lg">
              ${releasedAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-900 font-semibold text-base">Milestones</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {contract.milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 text-sm font-medium truncate">
                  {milestone.title}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border flex-shrink-0 ${milestoneStatusStyles[milestone.status]}`}
              >
                {milestoneStatusLabel[milestone.status]}
              </span>
              <span className="text-slate-900 text-sm font-semibold flex-shrink-0">
                ${milestone.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
          Request approval
        </button>
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors">
          Message client
        </button>
      </div>
    </div>
  );
};

export default ContractPage;