interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-2",
};

export const LoadingSpinner = ({
  size = "md",
  label = "Loading...",
}: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <div
      className={`${sizeMap[size]} border-slate-200 border-t-indigo-600 rounded-full animate-spin`}
      role="status"
      aria-label={label}
    />
    {label && (
      <p className="text-slate-500 text-sm">{label}</p>
    )}
  </div>
);