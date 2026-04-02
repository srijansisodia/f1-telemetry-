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
        // Brand
        "neon-purple": "#8B5CF6",
        "neon-cyan": "#06B6D4",
        "neon-pink": "#EC4899",
        "neon-amber": "#F59E0B",
        "neon-green": "#10B981",
        // Backgrounds
        "bg-base": "#0A0A0F",
        "bg-surface": "#0F0F1A",
        "bg-elevated": "#141428",
        // Text
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#475569",
        "text-data": "#06B6D4",
        // Podium
        "podium-gold": "#FFD700",
        "podium-silver": "#C0C0C0",
        "podium-bronze": "#CD7F32",
        // Teams
        "team-red-bull": "#3671C6",
        "team-mercedes": "#27F4D2",
        "team-ferrari": "#E8002D",
        "team-mclaren": "#FF8000",
        "team-aston": "#358C75",
        "team-alpine": "#FF87BC",
        "team-williams": "#64C4FF",
        "team-rb": "#6692FF",
        "team-haas": "#B6BABD",
        "team-sauber": "#52E252",
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-hover": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.4)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.4)",
        "glow-gold": "0 0 24px rgba(255,215,0,0.35)",
        "glow-silver": "0 0 24px rgba(192,192,192,0.3)",
        "glow-bronze": "0 0 24px rgba(205,127,50,0.35)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "data-flicker": "dataFlicker 0.15s ease-in-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        dataFlicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
