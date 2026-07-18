import type { Config } from "tailwindcss"
import baseConfig from "@neuroplus/config/tailwind"

const config: Config = {
  ...baseConfig,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
}

export default config
