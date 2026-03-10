import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        btg: {
          navy: "#0D1B2E",
          "navy-light": "#152338",
          "navy-card": "#1A2B3E",
          "navy-border": "#243447",
          gold: "#F0A500",
          "gold-light": "#F5C842",
          "gold-dark": "#C17A00",
          text: "#E8EDF2",
          "text-muted": "#7A8FA3",
          "text-dim": "#4A5E70",
        },
        status: {
          new: "#3B82F6",
          contacted: "#8B5CF6",
          analysis: "#F59E0B",
          proposal: "#EC4899",
          negotiation: "#10B981",
          won: "#22C55E",
          lost: "#EF4444",
          hold: "#6B7280",
        },
        risk: {
          low: "#22C55E",
          medium: "#F59E0B",
          high: "#EF4444",
        },
        product: {
          credit: "#3B82F6",
          structured: "#8B5CF6",
          project: "#10B981",
          guarantee: "#F59E0B",
          special: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-btg": "linear-gradient(135deg, #0D1B2E 0%, #152338 100%)",
        "gradient-gold": "linear-gradient(135deg, #F0A500 0%, #F5C842 100%)",
        "gradient-card": "linear-gradient(135deg, #1A2B3E 0%, #1F3347 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(240, 165, 0, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-gold": "pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        radar: "radar 3s linear infinite",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-in": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        radar: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
