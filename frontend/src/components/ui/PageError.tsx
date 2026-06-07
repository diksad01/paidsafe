import { Link } from "react-router-dom";

type PageErrorVariant = "not_found" | "permission_denied" | "network" | "generic";

interface PageErrorProps {
  variant?: PageErrorVariant;
  message?: string;
  backTo?: string;
  backLabel?: string;
  onRetry?: () => void;
}

const config: Record<PageErrorVariant, { icon: string; title: string; description: string }> = {
  not_found: {
    icon: "?",
    title: "Not found",
    description: "This page doesn't exist or has been removed.",
  },
  permission_denied: {
    icon: "🔒",
    title: "Access denied",
    description: "You don't have permission to view this resource.",
  },
  network: {
    icon: "⚡",
    title: "Connection error",
    description: "Could not reach the server. Check your connection and try again.",
  },
  generic: {
    icon: "!",
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
  },
};

export const PageError = ({
  variant = "generic",
  message,
  backTo = "/dashboard",
  backLabel = "Back to dashboard",
  onRetry,
}: PageErrorProps) => {
  const { icon, title, description } = config[variant];

  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">{icon}</span>
      </div>

      <h2 className="text-slate-900 font-bold text-xl mb-2">{title}</h2>

      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {message ?? description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Try again
          </button>
        )}
        <Link
          to={backTo}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors text-center"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
};