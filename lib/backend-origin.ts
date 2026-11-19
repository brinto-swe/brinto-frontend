export function backendOrigin() {
  try {
    const url = new URL(process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:5000")
    if (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    ) return url.origin
  } catch {
    // Report configuration failures without including the supplied origin.
  }
  throw new Error("BACKEND_ORIGIN must be an HTTP or HTTPS origin.")
}
