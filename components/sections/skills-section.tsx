import {
  HiOutlineCircleStack,
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineRectangleStack,
} from "react-icons/hi2"
import { SectionHeading, Wave } from "@/components/shared/portfolio-ui"
import { TechnologyIcon } from "@/components/shared/technology-icon"
import { skillGroups } from "@/data/portfolio"

const groupIcons = {
  screen: HiOutlineComputerDesktop,
  code: HiOutlineCodeBracket,
  database: HiOutlineCircleStack,
  workflow: HiOutlineCommandLine,
  ai: HiOutlineCpuChip,
  stack: HiOutlineRectangleStack,
}

const skillHighlights = [
  {
    icon: HiOutlineCodeBracket,
    title: "Full-Stack Development",
    text: "Building end-to-end web applications.",
  },
  {
    icon: HiOutlineCpuChip,
    title: "AI & Data",
    text: "Applying machine learning to practical problems.",
  },
  {
    icon: HiOutlineCommandLine,
    title: "Development Workflow",
    text: "Using version control and modern tooling to collaborate.",
  },
]

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="portfolio-section skills-section"
      aria-labelledby="skills-title"
    >
      <div className="portfolio-container">
        <SectionHeading
          id="skills-title"
          label="My Skills"
          title="Technical"
          accent="Skills"
          icon={HiOutlineRectangleStack}
          description="Technologies and tools I use to build modern, reliable applications."
        />
        <div className="skills-layout">
          <div className="skills-overview" data-reveal>
            <h3>
              My <span>Skillset</span>
            </h3>
            <p>
              I work across the web stack and use AI and machine learning tools
              to build practical, user-centered software.
            </p>
            <ul>
              {skillHighlights.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="icon-tile">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="skills-grid">
            {skillGroups.map(({ title, icon, skills }, index) => {
              const Icon = groupIcons[icon]
              return (
                <article
                  className="portfolio-card skill-card"
                  key={title}
                  data-reveal
                  data-stagger={index % 3}
                >
                  <h3>
                    <Icon aria-hidden="true" />
                    {title}
                  </h3>
                  <ul>
                    {skills.map((skill) => (
                      <li key={skill}>
                        <TechnologyIcon name={skill} />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </div>
      <Wave />
    </section>
  )
}
