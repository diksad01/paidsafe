interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner = ({
  message,
  onRetry,
  onDismiss,
}: ErrorBannerProps) => (
  <div
    role="alert"
    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
  >
    <svg
      className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <p className="text-red-700 text-sm flex-1 leading-relaxed">{message}</p>

    <div className="flex items-center gap-2 flex-shrink-0">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 text-xs font-semibold underline underline-offset-2 transition-colors"
        >
          Retry
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  </div>
);