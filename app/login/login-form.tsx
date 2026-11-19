"use client"

import { useRef, useState, type FormEvent } from "react"
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react"
import { signIn, signOut } from "@/lib/auth-client"

const unavailable = "Sign-in is temporarily unavailable. Please try again shortly."

export function LoginForm({ sessionUnavailable }: { sessionUnavailable: boolean }) {
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(sessionUnavailable ? unavailable : "")
  const busy = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current) return

    const form = event.currentTarget
    const values = new FormData(form)
    const email = String(values.get("email") ?? "").trim()
    const password = String(values.get("password") ?? "")
    if (!email || !password) {
      setError("Enter your email address and password.")
      form.querySelector<HTMLInputElement>(email ? "#owner-password" : "#owner-email")?.focus()
      return
    }

    busy.current = true
    setPending(true)
    setError("")
    let navigating = false
    let sessionCreated = false
    try {
      const result = await signIn.email({ email, password, rememberMe: false })
      if (result.error || !result.data) {
        setError(
          result.error?.code === "INVALID_EMAIL_OR_PASSWORD" || result.error?.code === "EMAIL_NOT_VERIFIED"
            ? "The email address or password is incorrect."
            : result.error?.status === 429
              ? "Too many sign-in attempts. Wait a moment and try again."
              : unavailable
        )
        return
      }

      sessionCreated = true
      const owner = await fetch("/api/admin/session", {
        credentials: "same-origin",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(6000),
      })
      if (owner.status === 200) {
        const { owner: identity } = await owner.json()
        if (typeof identity?.id === "string" && identity.id && typeof identity.email === "string" && identity.email) {
          window.location.replace("/admin")
          navigating = true
          return
        }
      }
      setError(owner.status === 401 || owner.status === 403 ? "This account does not have access to the owner workspace." : unavailable)
    } catch {
      setError(unavailable)
    } finally {
      if (sessionCreated && !navigating) {
        try {
          const result = await signOut()
          if (result.error || !result.data?.success) {
            setError("Access could not be verified, and the session could not be ended. Please try again shortly.")
          }
        } catch {
          setError("Access could not be verified, and the session could not be ended. Please try again shortly.")
        }
      }
      if (!navigating) {
        busy.current = false
        setPending(false)
      }
    }
  }

  return (
    <form className="login-form" method="post" onSubmit={submit} aria-busy={pending}>
      <div className="login-field">
        <label htmlFor="owner-email">Email address</label>
        <div className="login-input">
          <Mail size={19} aria-hidden="true" />
          <input id="owner-email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Enter your email" required readOnly={pending} />
        </div>
      </div>
      <div className="login-field">
        <label htmlFor="owner-password">Password</label>
        <div className="login-input">
          <LockKeyhole size={19} aria-hidden="true" />
          <input id="owner-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required readOnly={pending} />
          <button type="button" aria-label={visible ? "Hide password" : "Show password"} aria-controls="owner-password" onClick={() => setVisible(!visible)}>
            {visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="login-submit" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="login-spinner" size={19} aria-hidden="true" /> : <LogIn size={19} aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
