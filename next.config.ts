import type { NextConfig } from "next"
import { backendOrigin } from "./lib/backend-origin"

const nextConfig: NextConfig = {
  experimental: { authInterrupts: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin()}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
