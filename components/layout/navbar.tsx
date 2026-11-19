"use client"

import { useEffect, useRef, useState } from "react"
import { HiOutlineBars3, HiOutlineUser, HiOutlineXMark } from "react-icons/hi2"
import { Brand } from "@/components/shared/portfolio-ui"
import { navigation } from "@/data/portfolio"
import { banglaNavigation } from "@/data/blog/copy"
import type { Language } from "@/data/blog/schema"

export function Navbar({ blogLanguage }: { blogLanguage?: Language }) {
  const [active, setActive] = useState("#home")
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const bangla = blogLanguage === "bn"

  useEffect(() => {
    if (blogLanguage) return
    const sections = navigation.flatMap(({ href }) => {
      const section = href.startsWith("#")
        ? document.getElementById(href.slice(1))
        : null
      return section ? [section] : []
    })

    function updateActive() {
      const activationLine = Math.min(window.innerHeight * 0.33, 230)
      const section = sections.findLast(
        (element) => element.getBoundingClientRect().top <= activationLine
      )
      setActive(section ? `#${section.id}` : "#home")
    }

    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [blogLanguage])

  return (
    <header className="portfolio-header">
      <nav
        className="portfolio-nav portfolio-container"
        aria-label={bangla ? "প্রধান নেভিগেশন" : "Main navigation"}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false)
            toggle.current?.focus()
          }
        }}
      >
        <Brand
          href={blogLanguage ? "/#home" : undefined}
          fullName={Boolean(blogLanguage)}
          label={bangla ? "Brinto.dev হোম" : undefined}
          onClick={() => setOpen(false)}
        />
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-label={
            bangla
              ? open
                ? "মেনু বন্ধ করুন"
                : "মেনু খুলুন"
              : open
                ? "Close menu"
                : "Open menu"
          }
          aria-controls="portfolio-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <HiOutlineXMark aria-hidden="true" />
          ) : (
            <HiOutlineBars3 aria-hidden="true" />
          )}
        </button>
        <div
          id="portfolio-navigation"
          className="navigation-panel"
          data-open={open}
        >
          <ul className="navigation-links">
            {navigation.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={
                    blogLanguage && href.startsWith("#") ? `/${href}` : href
                  }
                  aria-current={
                    blogLanguage
                      ? href === "/blogs"
                        ? "page"
                        : undefined
                      : active === href
                        ? "location"
                        : undefined
                  }
                  onClick={() => {
                    if (href.startsWith("#")) setActive(href)
                    setOpen(false)
                  }}
                >
                  {bangla ? banglaNavigation[label] : label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/login"
            className="portfolio-button portfolio-button--outline login-link"
            onClick={() => setOpen(false)}
          >
            <HiOutlineUser aria-hidden="true" /> {bangla ? "লগইন" : "Login"}
          </a>
        </div>
      </nav>
    </header>
  )
}
