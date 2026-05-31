import { Link } from "react-router-dom";

type ContractStatus = "active" | "pending" | "completed";

interface Contract {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: ContractStatus;
}

const contracts: Contract[] = [
  { id: "c-001", title: "Brand Identity Design", client: "Acme Corp", amount: 2400, status: "active" },
  { id: "c-002", title: "Mobile App MVP", client: "Stark Industries", amount: 8000, status: "pending" },
  { id: "c-003", title: "SEO Audit & Strategy", client: "Globex Co", amount: 1200, status: "completed" },
  { id: "c-004", title: "E-commerce Redesign", client: "Initech LLC", amount: 5500, status: "active" },
];

const statusStyles: Record<ContractStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const stats = [
  { label: "Total Contracts", value: "12" },
  { label: "In Escrow", value: "$14,200" },
  { label: "Released", value: "$38,500" },
  { label: "Pending Approval", value: "3" },
];

const DashboardPage = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your contracts and payments
          </p>
        </div>
        <Link
          to="/contract/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          New Contract
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5"
          >
            <p className="text-slate-500 text-xs font-medium mb-1">{stat.label}</p>
            <p className="text-slate-900 text-xl sm:text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-slate-900 font-semibold text-base">Recent Contracts</h2>
          <span className="text-slate-400 text-xs">{contracts.length} total</span>
        </div>
        <div className="divide-y divide-slate-100">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              to={`/contract/${contract.id}`}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-xs font-bold">
                    {contract.client.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-slate-900 font-medium text-sm group-hover:text-indigo-600 transition-colors">
                    {contract.title}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">{contract.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-13 sm:ml-0">
                <span
                  className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[contract.status]}`}
                >
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </span>
                <span className="text-slate-900 font-semibold text-sm ml-auto sm:ml-0">
                  ${contract.amount.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;