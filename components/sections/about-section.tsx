import {
  HiOutlineArrowTrendingUp,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlineRectangleStack,
  HiOutlineUser,
} from "react-icons/hi2"
import { SectionHeading, Wave } from "@/components/shared/portfolio-ui"
import { aboutFeatures } from "@/data/portfolio"

const featureIcons = {
  code: HiOutlineCodeBracket,
  stack: HiOutlineRectangleStack,
  ai: HiOutlineCpuChip,
  growth: HiOutlineArrowTrendingUp,
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="portfolio-section about-section"
      aria-labelledby="about-title"
    >
      <div className="portfolio-container about-grid">
        <div className="about-copy" data-reveal>
          <SectionHeading
            id="about-title"
            label="About Me"
            title="About"
            accent="Me"
            icon={HiOutlineUser}
            align="left"
          />
          <p>
            I’m a full-stack web developer focused on building modern, scalable,
            and user-friendly applications. I turn ideas into working software
            with React, Next.js, Django, and Node.js.
          </p>
          <p>
            I care about clean code and enjoy solving practical problems. My
            research explores how AI can improve real-world applications,
            especially in agriculture.
          </p>
        </div>
        <div className="about-features">
          {aboutFeatures.map(({ icon, title, description }, index) => {
            const Icon = featureIcons[icon]
            return (
              <article
                key={title}
                className="portfolio-card about-card"
                data-reveal
                data-stagger={index}
              >
                <div className="card-title">
                  <span className="icon-tile">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                </div>
                <p>{description}</p>
              </article>
            )
          })}
        </div>
      </div>
      <Wave />
    </section>
  )
}
