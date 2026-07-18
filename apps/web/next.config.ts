import type { NextConfig } from "next"
import path from "path"

const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "@neuroplus/ui",
    "@neuroplus/hooks",
    "@neuroplus/types",
  ],
}

export default config
