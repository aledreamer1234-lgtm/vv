import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["Courier New", "monospace"],
      },
      colors: {
        ink: "#f8f8f8",
        panel: "#ffffff",
        frost: "rgba(0,0,0,0.04)",
        cyan: "#1a1a1a",
        coin: "#000000",
        violet: "#333333",
        azure: "#444444",
        amber: "#555555",
      },
      boxShadow: {
        glow: "0 0 0 rgba(0,0,0,0)",
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "radial-fade": "none",
      },
      letterSpacing: {
        display: "-0.03em",
      },
    },
  },
  plugins: [],
} satisfies Config;
