import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateContract } from "../features/contracts/hooks/useCreateContract";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { CreateContractInput } from "../types/contract";

type MilestoneField = "title" | "description" | "amount";

// Explicit inline interface to type our dynamic array parameter wrappers safely
interface LocalMilestone {
  title: string;
  description: string;
  amount: number;
  order: number;
}

const NewContractPage = () => {
  const navigate = useNavigate();
  const {
    milestones,
    setMilestones,
    aiLoading,
    aiError,
    saveLoading,
    saveError,
    suggestMilestones,
    clearAiError,
    submitContract,
  } = useCreateContract();

  const [title, setTitle] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  const addMilestone = () => {
    setMilestones((prev: LocalMilestone[]) => [
      ...prev,
      { title: "", description: "", amount: 0, order: prev.length },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones((prev: LocalMilestone[]) => prev.filter((_, i: number) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: MilestoneField,
    value: string
  ) => {
    setMilestones((prev: LocalMilestone[]) =>
      prev.map((m: LocalMilestone, i: number) =>
        i === index
          ? { ...m, [field]: field === "amount" ? parseFloat(value) || 0 : value }
          : m
      )
    );
  };

  const handleSuggest = async () => {
    if (!description.trim()) return;
    await suggestMilestones(description);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateContractInput = {
      title,
      clientEmail,
      description,
      milestones,
    };

    await submitContract(input);
  };

  // Fixed reduce implicitly typed variables explicitly
  const totalAmount = milestones.reduce((sum: number, m: LocalMilestone) => sum + (m.amount || 0), 0);

  const inputClass =
    "w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed";

  // Fixed array iteration verification methods safely typed
  const isFormValid =
    title.trim().length > 0 &&
    clientEmail.trim().length > 0 &&
    milestones.length > 0 &&
    milestones.every((m: LocalMilestone) => m.title.trim().length > 0 && m.amount > 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          New Contract
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Define terms, milestones, and payment details
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-slate-900 font-semibold text-base">
            Contract details
          </h2>

          {saveError && (
            <ErrorBanner message={saveError} />
          )}

          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1.5">
              Contract title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brand Identity Design"
              required
              disabled={saveLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1.5">
              Client email
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@company.com"
              required
              disabled={saveLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1.5">
              Total budget
              <span className="text-slate-400 text-xs font-normal normal-case ml-1">
                (optional — helps AI suggest amounts)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="0.00"
                min="0"
                disabled={saveLoading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-1.5">
              Scope of work
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the deliverables and expectations..."
              rows={4}
              disabled={saveLoading}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-semibold text-base">
              Milestones
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSuggest}
                disabled={
                  aiLoading ||
                  saveLoading ||
                  description.trim().length === 0
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {aiLoading ? (
                  <>
                    <div className="w-3 h-3 border border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Suggest with AI
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={addMilestone}
                disabled={saveLoading}
                className="text-indigo-600 hover:text-indigo-500 disabled:text-slate-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {aiError && (
            <ErrorBanner message={aiError} onDismiss={clearAiError} />
          )}

          {aiLoading && (
            <div className="py-8">
              <LoadingSpinner size="sm" label="Generating milestone suggestions..." />
            </div>
          )}

          {!aiLoading && (
            <div className="space-y-3">
              {milestones.map((milestone: LocalMilestone, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 items-start bg-slate-50 rounded-xl p-4"
                >
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                      placeholder="Milestone title"
                      disabled={saveLoading}
                      className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) =>
                        updateMilestone(index, "description", e.target.value)
                      }
                      placeholder="Description (optional)"
                      disabled={saveLoading}
                      className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        value={milestone.amount || ""}
                        onChange={(e) =>
                          updateMilestone(index, "amount", e.target.value)
                        }
                        placeholder="0.00"
                        min="0"
                        disabled={saveLoading}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      disabled={saveLoading}
                      className="text-slate-300 hover:text-red-400 disabled:cursor-not-allowed transition-colors mt-0.5 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalAmount > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-600 text-sm font-medium">
                Total contract value
              </span>
              <span className="text-slate-900 text-lg font-bold tabular-nums">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!isFormValid || saveLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saveLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Create & send contract"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={saveLoading}
            className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:cursor-not-allowed text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContractPage;