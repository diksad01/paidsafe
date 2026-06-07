export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2D3748",
          accent: "#6C63FF",
          "accent-light": "#EEF0FF",
          bg: "#FFFFFF",
          "card-bg": "#F7F8FA",
          "text-primary": "#1A202C",
          "text-secondary": "#718096",
          "accent-hover": "#5A52E0",
          "accent-muted": "#D6D3FF",
          border: "#E2E8F0",
          "border-focus": "#6C63FF",
          success: "#38A169",
          "success-light": "#F0FFF4",
          warning: "#D69E2E",
          "warning-light": "#FFFFF0",
          danger: "#E53E3E",
          "danger-light": "#FFF5F5",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Syne'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px 0 rgba(108,99,255,0.10), 0 1px 3px 0 rgba(0,0,0,0.06)",
        "input-focus": "0 0 0 3px rgba(108,99,255,0.15)",
        btn: "0 1px 2px 0 rgba(108,99,255,0.20)",
        "btn-hover": "0 4px 12px 0 rgba(108,99,255,0.30)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse_soft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s cubic-bezier(0.4,0,0.2,1) both",
        shimmer: "shimmer 1.6s linear infinite",
        pulse_soft: "pulse_soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};