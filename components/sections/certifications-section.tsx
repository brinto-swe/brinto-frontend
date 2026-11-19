import { FaAws, FaMicrosoft } from "react-icons/fa6"
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
} from "react-icons/hi2"
import { SiDjango, SiDocker, SiGoogle, SiMeta } from "react-icons/si"
import { SectionHeading, Wave } from "@/components/shared/portfolio-ui"
import { certifications } from "@/data/portfolio"

const providerIcons = {
  aws: FaAws,
  google: SiGoogle,
  docker: SiDocker,
  meta: SiMeta,
  microsoft: FaMicrosoft,
  django: SiDjango,
}

export function CertificationsSection() {
  return (
    <section
      id="certifications"
      className="portfolio-section certifications-section"
      aria-labelledby="certifications-title"
    >
      <div className="portfolio-container">
        <SectionHeading
          id="certifications-title"
          label="My Certifications"
          title="Certifications &"
          accent="Achievements"
          icon={HiOutlineCheckBadge}
          description="Example credentials show how verified achievements will appear once added."
        />
        <div className="certification-grid">
          {certifications.map(
            (
              {
                title,
                issuer,
                logo,
                issueDate,
                verificationUrl,
                verified,
                demo,
              },
              index
            ) => {
              const Logo = providerIcons[logo]
              return (
                <article
                  key={title}
                  className="portfolio-card certification-card"
                  data-reveal
                  data-stagger={index % 3}
                >
                  <span className={`provider-logo provider-logo--${logo}`}>
                    <Logo aria-hidden="true" />
                  </span>
                  <div className="certification-copy">
                    <h3>{title}</h3>
                    <p>{issuer}</p>
                    <div className="certification-meta">
                      {issueDate && (
                        <time dateTime={issueDate.value}>
                          <HiOutlineCalendarDays aria-hidden="true" />
                          {issueDate.label}
                        </time>
                      )}
                      {verified && !demo && (
                        <span className="verified-label">
                          <HiOutlineCheckBadge aria-hidden="true" /> Verified
                        </span>
                      )}
                      {demo && (
                        <span className="status-pill">Demo credential</span>
                      )}
                      {verificationUrl && !demo && (
                        <a
                          href={verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View certificate{" "}
                          <HiOutlineArrowTopRightOnSquare aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )
            }
          )}
        </div>
      </div>
      <Wave />
    </section>
  )
}
