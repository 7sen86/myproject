import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"], // El Messiri: للعناوين
        body: ["var(--font-body)"], // Tajawal: للنصوص
      },
      colors: {
        // هوية بصرية مستوحاة من الدفتر والملزمة نفسها: حبر داكن + قلم تحديد (هايلايتر)
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          light: "rgb(var(--color-ink-light) / <alpha-value>)",
          50: "#EEF1F8",
        },
        paper: "#F4F5F8",
        marker: {
          DEFAULT: "rgb(var(--color-marker) / <alpha-value>)",
          dark: "rgb(var(--color-marker-dark) / <alpha-value>)",
          50: "#FEF6E7",
        },
        leaf: "#2E9E68",
        clay: "#D6483F",
        charcoal: "#1A1D23",
        mist: "#8791A6",
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,42,74,0.06), 0 8px 24px -12px rgba(30,42,74,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
