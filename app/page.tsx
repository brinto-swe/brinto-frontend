import type { Metadata } from "next"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { AboutSection } from "@/components/sections/about-section"
import { CertificationsSection } from "@/components/sections/certifications-section"
import { ContactSection } from "@/components/sections/contact-section"
import { EducationSection } from "@/components/sections/education-section"
import { HeroSection } from "@/components/sections/hero-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import "./portfolio.css"

export const metadata: Metadata = {
  title: "Brinto.dev | K M Mozaddedul Islam",
  description:
    "Portfolio of K M Mozaddedul Islam (Brinto), a software engineer, AI researcher, and full-stack developer.",
}

export default function Page() {
  return (
    <div className="portfolio">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollReveal />
    </div>
  )
}
