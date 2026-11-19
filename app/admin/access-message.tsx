import Link from "next/link"
import styles from "./access-message.module.css"

export function AdminAccessMessage({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1>{unavailable ? "Admin workspace unavailable" : "Access denied"}</h1>
        <p>{unavailable ? "We couldn’t verify your owner session. Please try again shortly." : "Only the verified owner can access this workspace."}</p>
        <nav aria-label="Available pages">
          <Link href="/login">Sign in</Link>
          <Link href="/">Back to portfolio</Link>
        </nav>
      </section>
    </main>
  )
}
