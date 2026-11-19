import {
  HiOutlineAcademicCap,
  HiOutlineCheckBadge,
  HiOutlineCodeBracket,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineFolder,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUser,
} from "react-icons/hi2"
import { Brand, SocialLinks, Wave } from "@/components/shared/portfolio-ui"
import { navigation, profile } from "@/data/portfolio"

const footerIcons = {
  Home: HiOutlineHome,
  About: HiOutlineUser,
  Education: HiOutlineAcademicCap,
  Skills: HiOutlineCodeBracket,
  Projects: HiOutlineFolder,
  Certifications: HiOutlineCheckBadge,
  Blogs: HiOutlineDocumentText,
  Contact: HiOutlineEnvelope,
}

export function Footer() {
  return (
    <footer className="portfolio-footer">
      <Wave className="footer-wave footer-wave--top" />
      <div className="portfolio-container footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand footer />
            <p>
              Full-stack developer and AI researcher building modern, scalable
              web applications and exploring practical uses of artificial
              intelligence.
            </p>
          </div>
          {["Quick Links", "More"].map((title, index) => (
            <nav className="footer-column" key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul>
                {navigation
                  .slice(index * 4, index * 4 + 4)
                  .map(({ label, href }) => {
                    const Icon = footerIcons[label as keyof typeof footerIcons]
                    return (
                      <li key={href}>
                        <a href={href}>
                          <Icon aria-hidden="true" />
                          {label}
                        </a>
                      </li>
                    )
                  })}
              </ul>
            </nav>
          ))}
          <div className="footer-column footer-contact">
            <h2>Get in Touch</h2>
            <ul>
              <li>
                <HiOutlineEnvelope aria-hidden="true" />
                {profile.email ? (
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                ) : (
                  <a href="#contact">Contact form</a>
                )}
              </li>
              <li>
                <HiOutlineMapPin aria-hidden="true" />
                {profile.location}
              </li>
            </ul>
            <SocialLinks />
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Brinto.dev. All rights reserved.</p>
          <p>
            <HiOutlineHeart aria-hidden="true" /> Built with Next.js, React,
            Tailwind CSS &amp; MongoDB
          </p>
        </div>
      </div>
      <Wave className="footer-wave footer-wave--bottom" />
    </footer>
  )
}
