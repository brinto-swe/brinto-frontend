import type { NextConfig } from "next"

function backendOrigin() {
  try {
    const url = new URL(process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:5000")
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error()
    }
    return url.origin
  } catch {
    throw new Error("BACKEND_ORIGIN must be an HTTP or HTTPS origin.")
  }
}

const nextConfig: NextConfig = {
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
