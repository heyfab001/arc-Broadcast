import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090E",
        surface: {
          50: "#1A2234",
          100: "#141A28",
          200: "#0F1420",
          300: "#0B0E17",
          400: "#080A10",
        },
        arc: {
          50: "#EDF5FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          cyan: "#00F5D4",
          purple: "#8B5CF6",
          violet: "#7C3AED",
          glow: "#3B82F633",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "arc-glow": "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "primary-gradient": "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
        "cyan-blue-gradient": "linear-gradient(135deg, #00F5D4 0%, #3B82F6 100%)",
      },
      boxShadow: {
        "arc-glow": "0 0 30px -5px rgba(59, 130, 246, 0.25)",
        "arc-glow-lg": "0 0 50px -10px rgba(99, 102, 241, 0.35)",
        "card-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
