import type { IconType } from "react-icons"
import {
  FaGithub,
  FaLinkedinIn,
  FaMedium,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"
import { HiOutlineCodeBracket, HiOutlineGlobeAlt } from "react-icons/hi2"
import { socialProfiles } from "@/data/portfolio"

const socialIcons: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  YouTube: FaYoutube,
  Medium: FaMedium,
  X: FaXTwitter,
}

export function Brand({
  footer = false,
  onClick,
}: {
  footer?: boolean
  onClick?: () => void
}) {
  return (
    <a
      className="portfolio-brand"
      href="#home"
      aria-label="Brinto.dev home"
      onClick={onClick}
    >
      <span className="brand-mark">
        <HiOutlineCodeBracket aria-hidden="true" />
      </span>
      <span>
        Brinto<span className="brand-accent">{footer ? ".dev" : "."}</span>
      </span>
    </a>
  )
}

export function SectionHeading({
  id,
  label,
  title,
  accent,
  description,
  icon: Icon,
  align = "center",
}: {
  id: string
  label: string
  title: string
  accent: string
  description?: string
  icon: IconType
  align?: "left" | "center"
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="section-label">
        <Icon aria-hidden="true" /> {label}
      </span>
      <h2 id={id}>
        {title} <span>{accent}</span>
      </h2>
      <span className="heading-rule" aria-hidden="true" />
      {description && <p>{description}</p>}
    </div>
  )
}

export function SocialLinks() {
  return (
    <ul className="social-links" aria-label="Social profiles">
      {socialProfiles.map(({ label, url }) => {
        const Icon = socialIcons[label] ?? HiOutlineGlobeAlt
        return (
          <li key={label}>
            {url ? (
              <a href={url} aria-label={label} target="_blank" rel="noreferrer">
                <Icon aria-hidden="true" />
              </a>
            ) : (
              <span aria-disabled="true" title={`${label} profile coming soon`}>
                <Icon aria-hidden="true" />
                <span className="sr-only">{label} profile coming soon</span>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`portfolio-wave ${className}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="wave-back"
        d="M0 46C165 3 219 117 430 96C625 77 680 1 881 36C1074 70 1168 117 1440 26V120H0Z"
      />
      <path
        className="wave-front"
        d="M0 70C190 8 290 133 539 108C700 92 763 42 917 51C1103 63 1177 130 1440 53V120H0Z"
      />
    </svg>
  )
}
