import type { Config } from "tailwindcss"

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6fb7b0",
          light: "#8ec9c3",
          dark: "#4a9a93",
          fg: "#1c1e26",
        },
        released: {
          DEFAULT: "#6fb7b0",
          bg: "#252830",
          text: "#edeef2",
        },
        pending: {
          DEFAULT: "#9a9eab",
          bg: "#22252e",
          text: "#9a9eab",
        },
        blocked: {
          DEFAULT: "#4a4d58",
          bg: "#1c1e26",
          text: "#6b7080",
        },
        caregiver: {
          bg: "#1c1e26",
          accent: "#6fb7b0",
          "accent-dark": "#4a9a93",
          "accent-light": "#252830",
          text: "#edeef2",
        },
        surface: {
          DEFAULT: "#252830",
          secondary: "#1c1e26",
          border: "#2f3340",
          "border-strong": "#3a3f4d",
        },
        text: {
          primary: "#edeef2",
          secondary: "#9a9eab",
          muted: "#6b7080",
          inverse: "#1c1e26",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.35" }],
        "3xl": ["1.875rem", { lineHeight: "1.25" }],
      },
      spacing: {
        "safe-b": "calc(env(safe-area-inset-bottom, 0px))",
        "nav-h": "64px",
        touch: "44px",
      },
      borderRadius: {
        card: "20px",
        pill: "9999px",
        sheet: "24px",
        check: "6px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.24), 0 1px 2px -1px rgba(0,0,0,0.18)",
        "card-md": "0 4px 16px 0 rgba(0,0,0,0.32)",
        nav: "0 4px 24px 0 rgba(0,0,0,0.40)",
        sheet: "0 -8px 32px 0 rgba(0,0,0,0.40)",
        fab: "0 4px 16px 0 rgba(111,183,176,0.35)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        collapse: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.28s cubic-bezier(.32,.72,0,1)",
        "fade-in": "fade-in 0.18s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        collapse: "collapse 0.18s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
