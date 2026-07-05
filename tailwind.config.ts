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
        navy: {
          50: "#f0f4fa",
          100: "#dce5f2",
          200: "#bfd0e8",
          300: "#93b0d6",
          400: "#6189c0",
          500: "#3f6aaa",
          600: "#2f538f",
          700: "#284474",
          800: "#243a61",
          900: "#101f3c",
          950: "#0a1428",
        },
        teal: {
          50: "#effcfa",
          100: "#c8f6f0",
          200: "#91ece3",
          300: "#59dad2",
          400: "#2cc0bb",
          500: "#13a4a1",
          600: "#0d8382",
          700: "#0f6868",
          800: "#115253",
          900: "#124445",
          950: "#03282a",
        },
        gold: {
          300: "#f3d489",
          400: "#ecbf5a",
          500: "#e3a93a",
          600: "#c9882a",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(16, 31, 60, 0.12)",
        lift: "0 12px 40px -12px rgba(16, 31, 60, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
