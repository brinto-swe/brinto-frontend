import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, CodeXml, LockKeyhole } from "lucide-react"
import { getOwnerSession } from "@/lib/owner-session"
import { LoginForm } from "./login-form"
import "./login.css"

export const metadata: Metadata = {
  title: "Sign In | Brinto.dev",
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const session = await getOwnerSession()
  if (session === "owner") redirect("/admin")

  return (
    <main className="login-page">
      <section className="login-brand" aria-label="Brinto.dev">
        <Link href="/" className="login-logo">
          <span><CodeXml aria-hidden="true" /></span>
          <strong>Brinto<em>.dev</em></strong>
        </Link>
        <div className="login-welcome">
          <p>Welcome back</p>
          <span>Manage your portfolio, blogs, and content from one place.</span>
        </div>
        <Image
          src="/blog/desk.webp"
          alt=""
          width={960}
          height={500}
          sizes="(max-width: 760px) 1px, 52vw"
          className="login-desk"
        />
      </section>
      <section className="login-entry">
        <div className="login-card">
          <div className="login-card-heading">
            <span className="login-lock"><LockKeyhole aria-hidden="true" /></span>
            <h1>Sign in to <em>Brinto.dev</em></h1>
            <p>Enter your owner credentials to open the workspace.</p>
          </div>
          <LoginForm sessionUnavailable={session === "unavailable"} />
        </div>
        <Link href="/" className="login-home"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</Link>
      </section>
    </main>
  )
}
