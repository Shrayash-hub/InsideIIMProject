/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Corporate palette */
        corp: {
          olive:    "#4E5944",
          "olive-dark": "#3a4333",
          "olive-light": "#6a7560",
          bg:       "#E2E2E2",
          surface:  "#FFFFFF",
          raised:   "#F5F5F5",
          border:   "#C8C8C8",
          text:     "#2C2C2C",
          muted:    "#6B6B6B",
          divider:  "#D0D0D0",
        },
        /* Keep terminal tokens for any residual refs */
        terminal: {
          bg:      "#080C14",
          surface: "#0D1421",
          raised:  "#111827",
          border:  "#1E2D45",
        },
      },
      fontFamily: {
        serif: ["Times New Roman", "Times", "Georgia", "serif"],
        sans:  ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
        mono:  ["Courier New", "Courier", "monospace"],
      },
      boxShadow: {
        corp:      "0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)",
        "corp-md": "0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)",
        "glow-blue":  "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-red":   "0 0 20px rgba(239, 68, 68, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink:   "blink 1s step-end infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
