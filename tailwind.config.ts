
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#e4e4e7", // Lighter gray border
        input: "#000000",
        ring: "#7f1184",
        background: "#ffffff",
        foreground: "#000000",
        primary: {
          DEFAULT: "#7f1184",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8E9196", // Neutral Gray
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#7f1184",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F1F1F1", // Light Gray
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#7f1184",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {},
      animation: {},
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
