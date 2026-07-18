import type { Config } from "tailwindcss"

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Monochrome system — matches the DailyLoop-style design
        brand: {
          DEFAULT: "#111111",
          light: "#F5F5F5",
          dark: "#000000",
        },
        // Status (semantic, kept for Hub/Jornada logic — displayed monochromatically)
        released: {
          DEFAULT: "#111111",
          bg:   "#F0F0F0",
          text: "#111111",
        },
        pending: {
          DEFAULT: "#888888",
          bg:   "#F5F5F5",
          text: "#666666",
        },
        blocked: {
          DEFAULT: "#CCCCCC",
          bg:   "#F9F9F9",
          text: "#999999",
        },
        // Cuidador — warm accent kept subtle
        caregiver: {
          bg:             "#FAFAFA",
          accent:         "#111111",
          "accent-dark":  "#000000",
          "accent-light": "#F0F0F0",
          text:           "#111111",
        },
        // Surface
        surface: {
          DEFAULT:       "#FFFFFF",
          secondary:     "#F5F5F5",
          border:        "#EBEBEB",
          "border-strong": "#D0D0D0",
        },
        text: {
          primary:   "#111111",
          secondary: "#666666",
          muted:     "#AAAAAA",
          inverse:   "#FFFFFF",
        },
      },
      fontFamily: {
        sans:  ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1.5" }],
        sm:   ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem",     { lineHeight: "1.6" }],
        lg:   ["1.125rem", { lineHeight: "1.5" }],
        xl:   ["1.25rem",  { lineHeight: "1.4" }],
        "2xl":["1.5rem",   { lineHeight: "1.35" }],
        "3xl":["1.875rem", { lineHeight: "1.25" }],
      },
      spacing: {
        "safe-b": "calc(env(safe-area-inset-bottom, 0px))",
        "nav-h":  "64px",
        "touch":  "44px",
      },
      borderRadius: {
        card:  "20px",
        pill:  "9999px",
        sheet: "24px",
        check: "6px",
      },
      boxShadow: {
        card:       "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-md":  "0 4px 16px 0 rgba(0,0,0,0.08)",
        nav:        "0 4px 24px 0 rgba(0,0,0,0.10)",
        sheet:      "0 -8px 32px 0 rgba(0,0,0,0.10)",
        fab:        "0 4px 16px 0 rgba(0,0,0,0.25)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
        "collapse": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up":  "slide-up 0.28s cubic-bezier(.32,.72,0,1)",
        "fade-in":   "fade-in 0.18s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "collapse":  "collapse 0.18s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
