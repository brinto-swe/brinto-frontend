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
import { banglaNavigation } from "@/data/blog/copy"
import type { Language } from "@/data/blog/schema"

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

export function Footer({ blogLanguage }: { blogLanguage?: Language }) {
  const bangla = blogLanguage === "bn"
  const home = blogLanguage ? "/" : ""
  return (
    <footer className="portfolio-footer" data-view-motion>
      <Wave className="footer-wave footer-wave--top" />
      <div className="portfolio-container footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand
              footer
              href={`${home}#home`}
              label={bangla ? "Brinto.dev হোম" : undefined}
            />
            <p>
              {bangla
                ? "ফুল-স্ট্যাক ডেভেলপার ও এআই গবেষক। আধুনিক ওয়েব অ্যাপ তৈরি করি এবং কৃত্রিম বুদ্ধিমত্তার ব্যবহারিক প্রয়োগ নিয়ে কাজ করি।"
                : "Full-stack developer and AI researcher building modern, scalable web applications and exploring practical uses of artificial intelligence."}
            </p>
          </div>
          {(bangla ? ["দ্রুত লিংক", "আরও"] : ["Quick Links", "More"]).map(
            (title, index) => (
              <nav className="footer-column" key={title} aria-label={title}>
                <h2>{title}</h2>
                <ul>
                  {navigation
                    .slice(index * 4, index * 4 + 4)
                    .map(({ label, href }) => {
                      const Icon = footerIcons[label]
                      return (
                        <li key={href}>
                          <a
                            href={
                              href.startsWith("#") ? `${home}${href}` : href
                            }
                            aria-current={
                              blogLanguage && href === "/blogs"
                                ? "page"
                                : undefined
                            }
                          >
                            <Icon aria-hidden="true" />
                            {bangla ? banglaNavigation[label] : label}
                          </a>
                        </li>
                      )
                    })}
                </ul>
              </nav>
            )
          )}
          <div className="footer-column footer-contact">
            <h2>{bangla ? "যোগাযোগ" : "Get in Touch"}</h2>
            <ul>
              <li>
                <HiOutlineEnvelope aria-hidden="true" />
                {profile.email ? (
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                ) : (
                  <a href={`${home}#contact`}>
                    {bangla ? "যোগাযোগ ফর্ম" : "Contact form"}
                  </a>
                )}
              </li>
              <li>
                <HiOutlineMapPin aria-hidden="true" />
                {bangla ? "ইয়াংঝৌ, চীন" : profile.location}
              </li>
            </ul>
            <SocialLinks language={blogLanguage} />
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            ©{" "}
            {new Intl.NumberFormat(bangla ? "bn-BD" : "en", {
              useGrouping: false,
            }).format(new Date().getFullYear())}{" "}
            Brinto.dev. {bangla ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <p>
            <HiOutlineHeart aria-hidden="true" />{" "}
            {bangla
              ? "Next.js, React, Tailwind CSS ও MongoDB দিয়ে তৈরি"
              : "Built with Next.js, React, Tailwind CSS & MongoDB"}
          </p>
        </div>
      </div>
      <Wave className="footer-wave footer-wave--bottom" />
    </footer>
  )
}
