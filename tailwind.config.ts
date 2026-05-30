import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        // shadcn/ui CSS variable tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Eagle Bank brand palette — teal
        brand: {
          50: "#e8f7f3",
          100: "#c0e8d8",
          200: "#8ed4bc",
          300: "#2ecc9e",
          400: "#1a9e78",
          500: "#1a7a5e",
          600: "#156b52",
          700: "#0f4c3a",
          800: "#1a2535",
          900: "#111c28",
          950: "#0a1018",
        },
        // Gold accent
        gold: {
          50: "#faf3e0",
          100: "#f0e0b0",
          200: "#e8cd80",
          500: "#c9a84c",
          600: "#b8962e",
          700: "#9a7d20",
        },
        // Semantic status tokens
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          foreground: "#ffffff",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          foreground: "#ffffff",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": [
          "4.5rem",
          { lineHeight: "5.625rem", letterSpacing: "-0.02em" },
        ],
        "display-xl": [
          "3.75rem",
          { lineHeight: "4.5rem", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "3rem",
          { lineHeight: "3.75rem", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "2.25rem",
          { lineHeight: "2.75rem", letterSpacing: "-0.02em" },
        ],
        "display-sm": [
          "1.875rem",
          { lineHeight: "2.375rem", letterSpacing: "-0.01em" },
        ],
        "display-xs": ["1.5rem", { lineHeight: "2rem" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        modal:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
