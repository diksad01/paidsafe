import { Link } from "react-router-dom";

export const EmptyContracts = () => (
  <div className="text-center py-16 px-4">
    <div className="w-16 h-16 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
      <svg
        className="w-8 h-8 text-[#6C63FF]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>

    <h3 className="text-[#F0F0FF] font-semibold text-base mb-2">
      No contracts yet
    </h3>

    <p className="text-[#8888AA] text-sm leading-relaxed mb-6 max-w-xs mx-auto">
      Create your first contract to start collecting payments safely through
      escrow.
    </p>

    <Link
      to="/contract/new"
      className="inline-flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Create your first contract
    </Link>
  </div>
);