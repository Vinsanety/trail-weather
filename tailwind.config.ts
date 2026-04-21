import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        trail_light: {
          primary: "#0f766e",
          secondary: "#0ea5e9",
          accent: "#84cc16",
          neutral: "#1f2937",
          "base-100": "#f8fafc",
          "base-200": "#f1f5f9",
          "base-300": "#cbd5e1",
          "base-content": "#0f172a",
          info: "#0284c7",
          success: "#15803d",
          warning: "#b45309",
          error: "#b91c1c",
        },
      },
      {
        trail_dark: {
          primary: "#2dd4bf",
          secondary: "#38bdf8",
          accent: "#a3e635",
          neutral: "#0b1220",
          "base-100": "#0f172a",
          "base-200": "#111827",
          "base-300": "#334155",
          "base-content": "#e2e8f0",
          info: "#38bdf8",
          success: "#4ade80",
          warning: "#f59e0b",
          error: "#f87171",
        },
      },
      {
        alpine_accent: {
          primary: "#7c3aed",
          secondary: "#0ea5e9",
          accent: "#f97316",
          neutral: "#1f1b2e",
          "base-100": "#f7f5ff",
          "base-200": "#ede9fe",
          "base-300": "#c4b5fd",
          "base-content": "#2e1065",
          info: "#2563eb",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
        },
      },
    ],
  },
};
export default config;
