"use client"

import { useEffect } from "react"

export function PortfolioMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.hasAttribute("data-view-motion")) {
            entry.target.toggleAttribute("data-in-view", entry.isIntersecting)
            continue
          }
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.18 }
    )

    document
      .querySelectorAll("[data-reveal], [data-view-motion]")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return null
}
