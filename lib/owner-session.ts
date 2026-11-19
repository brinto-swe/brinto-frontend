import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { forbidden, redirect } from "next/navigation"
import { backendOrigin } from "./backend-origin"

type OwnerSession = "owner" | "anonymous" | "denied" | "unavailable"

export const getOwnerSession = cache(async (): Promise<OwnerSession> => {
  const cookie = (await headers()).get("cookie")
  if (!cookie) return "anonymous"

  try {
    const response = await fetch(new URL("/api/admin/session", backendOrigin()), {
      headers: { Cookie: cookie, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(6000),
    })
    if (response.status === 401) return "anonymous"
    if (response.status === 403) return "denied"
    if (response.status === 200) {
      const { owner } = await response.json()
      if (typeof owner?.id === "string" && owner.id && typeof owner.email === "string" && owner.email) return "owner"
    }
  } catch {
    return "unavailable"
  }
  return "unavailable"
})

export async function requireOwnerSession() {
  const session = await getOwnerSession()
  if (session === "anonymous") redirect("/login")
  if (session === "denied") forbidden()
  return session
}
