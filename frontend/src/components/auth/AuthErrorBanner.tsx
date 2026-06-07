interface AuthErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export const AuthErrorBanner = ({ message, onDismiss }: AuthErrorBannerProps) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3 animate-fade-up"
    >
      <svg
        className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-300 text-xs flex-1 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="text-red-500 hover:text-red-300 transition-colors flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};