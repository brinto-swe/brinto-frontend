import { HiOutlineAcademicCap, HiOutlineBookOpen } from "react-icons/hi2"
import { SectionHeading } from "@/components/shared/portfolio-ui"
import { education } from "@/data/portfolio"

export function EducationSection() {
  return (
    <section
      id="education"
      className="portfolio-section education-section"
      aria-labelledby="education-title"
    >
      <div className="portfolio-container">
        <SectionHeading
          id="education-title"
          label="Education"
          title="Academic"
          accent="Background"
          icon={HiOutlineAcademicCap}
          description="Engineering studies at Yangzhou University."
        />
        <ol className="education-grid">
          {education.map(
            ({ degree, institution, current, description }, index) => (
              <li
                className="portfolio-card education-card"
                key={degree}
                data-reveal
                data-stagger={index}
              >
                <span className="icon-tile">
                  <HiOutlineBookOpen aria-hidden="true" />
                </span>
                <div>
                  <p className="education-institution">{institution}</p>
                  <h3>{degree}</h3>
                  {description && <p>{description}</p>}
                </div>
                {current && (
                  <span className="status-pill status-pill--current">
                    In progress
                  </span>
                )}
              </li>
            )
          )}
        </ol>
      </div>
    </section>
  )
}
