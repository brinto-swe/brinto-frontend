import type { Metadata } from "next"
import { AdminShell } from "@/components/admin/shell"
import { requireOwnerSession } from "@/lib/owner-session"
import { AdminAccessMessage } from "./access-message"
import "./admin.css"
import "../blogs/article-prose.css"

export const metadata: Metadata = {
  title: "Admin workspace | Brinto.dev",
  robots: { index: false, follow: false },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  if (await requireOwnerSession() === "unavailable") {
    return <AdminAccessMessage unavailable />
  }
  return <AdminShell>{children}</AdminShell>
}
