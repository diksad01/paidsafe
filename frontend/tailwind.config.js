export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F0F13",
          accent: "#6C63FF",
          "accent-light": "rgba(108, 99, 255, 0.1)",
          bg: "#0F0F13",
          "card-bg": "#1A1A24",
          "text-primary": "#F0F0FF",
          "text-secondary": "#8888AA",
          "accent-hover": "#5A52E0",
          "accent-muted": "#D6D3FF",
          border: "#2A2A3A",
          "border-focus": "#6C63FF",
          success: "#4FFFB0",
          "success-light": "rgba(79, 255, 176, 0.1)",
          warning: "#D69E2E",
          "warning-light": "#FFFFF0",
          danger: "#FF4D4D",
          "danger-light": "rgba(255, 77, 77, 0.1)",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
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
        "glow-indigo": "0 0 20px rgba(108, 99, 255, 0.15)",
        "glow-mint": "0 0 20px rgba(79, 255, 176, 0.15)",
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