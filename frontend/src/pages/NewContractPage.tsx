import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Milestone {
  id: string;
  description: string;
  amount: string;
}

const NewContractPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m1", description: "", amount: "" },
  ]);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: `m${Date.now()}`, description: "", amount: "" },
    ]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const totalAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const inputClass =
    "w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">New Contract</h1>
        <p className="text-slate-500 text-sm mt-1">
          Define terms, milestones, and payment details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-slate-900 font-semibold text-base">Contract details</h2>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">
              Contract title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brand Identity Design"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">
              Client email
            </label>
            <input
              type="email"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="client@company.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1.5">
              Scope of work
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the deliverables and expectations..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-semibold text-base">Milestones</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors"
            >
              + Add milestone
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex gap-3 items-start bg-slate-50 rounded-xl p-4"
              >
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(milestone.id, "description", e.target.value)
                    }
                    placeholder="Milestone description"
                    className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) =>
                        updateMilestone(milestone.id, "amount", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(milestone.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors mt-0.5 text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {totalAmount > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-600 text-sm font-medium">
                Total contract value
              </span>
              <span className="text-slate-900 text-lg font-bold">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Create & send contract
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContractPage;