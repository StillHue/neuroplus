import type { Config } from "tailwindcss"

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-accent)",
          light: "#8ec9c3",
          dark: "#4a9a93",
          fg: "var(--color-accent-fg)",
        },
        released: {
          DEFAULT: "var(--color-accent)",
          bg: "var(--color-surface)",
          text: "var(--color-text)",
        },
        pending: {
          DEFAULT: "var(--color-muted)",
          bg: "var(--color-surface-2)",
          text: "var(--color-muted)",
        },
        blocked: {
          DEFAULT: "var(--color-muted-3)",
          bg: "var(--color-bg)",
          text: "var(--color-muted-2)",
        },
        caregiver: {
          bg: "var(--color-bg)",
          accent: "var(--color-accent)",
          "accent-dark": "#4a9a93",
          "accent-light": "var(--color-surface)",
          text: "var(--color-text)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          secondary: "var(--color-bg)",
          border: "var(--color-border)",
          "border-strong": "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text)",
          secondary: "var(--color-muted)",
          muted: "var(--color-muted-2)",
          inverse: "var(--color-accent-fg)",
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
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-md": "0 4px 16px 0 rgba(0,0,0,0.12)",
        nav: "0 4px 24px 0 rgba(0,0,0,0.14)",
        sheet: "0 -8px 32px 0 rgba(0,0,0,0.16)",
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
