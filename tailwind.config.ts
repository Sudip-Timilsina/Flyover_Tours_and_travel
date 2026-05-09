import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        muted: "#E2E8F0",
        primary: {
          50: "#EAF2F8",
          100: "#D3E4EF",
          200: "#A9C9DE",
          300: "#7FB0CE",
          400: "#5596BD",
          500: "#2C7CAC",
          600: "#0B3C5D",
          700: "#08324E",
          800: "#06283F",
          900: "#041D30",
        },
        accent: {
          50: "#FFF4E8",
          100: "#FDE7CC",
          200: "#F9C997",
          300: "#F4A261",
          400: "#EE8E3F",
          500: "#E97A1B",
          600: "#D66A13",
          700: "#B35610",
          800: "#92430E",
          900: "#6E320A",
        },
        nepal: {
          50: "#EAF2F8",
          100: "#D3E4EF",
          200: "#A9C9DE",
          300: "#7FB0CE",
          400: "#5596BD",
          500: "#2C7CAC",
          600: "#0B3C5D",
          700: "#08324E",
          800: "#06283F",
          900: "#041D30",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(11, 60, 93, 0.12)",
        glow: "0 24px 60px rgba(244, 162, 97, 0.18)",
        glass: "0 10px 30px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      animation: {
        fade: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
        floatSlow: "floatSlow 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
