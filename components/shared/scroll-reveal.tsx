"use client"

import { useEffect } from "react"

export function ScrollReveal() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.18 }
    )

    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return null
}
