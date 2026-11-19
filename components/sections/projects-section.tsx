"use client"

import Image from "next/image"
import { useState } from "react"
import type { IconType } from "react-icons"
import { FaGithub } from "react-icons/fa6"
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlineRectangleStack,
} from "react-icons/hi2"
import { SectionHeading, Wave } from "@/components/shared/portfolio-ui"
import { TechnologyIcon } from "@/components/shared/technology-icon"
import { projectCategories, projects } from "@/data/portfolio"

const categoryIcons = {
  "Web Development": HiOutlineCodeBracket,
  "AI / ML": HiOutlineCpuChip,
  "Full-Stack": HiOutlineRectangleStack,
  Academic: HiOutlineAcademicCap,
}

function ProjectAction({
  url,
  title,
  icon: Icon,
}: {
  url?: string
  title: string
  icon: IconType
}) {
  return url ? (
    <a
      className="project-action"
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={title}
      title={title}
    >
      <Icon aria-hidden="true" />
    </a>
  ) : (
    <span
      className="project-action"
      aria-disabled="true"
      title={`${title} unavailable`}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{title} unavailable</span>
    </span>
  )
}

export function ProjectsSection() {
  const [selected, setSelected] =
    useState<(typeof projectCategories)[number]>("All Projects")
  const visibleProjects = projects.filter(
    ({ category, additionalCategory }) =>
      selected === "All Projects" ||
      selected === category ||
      selected === additionalCategory
  )

  return (
    <section
      id="projects"
      className="portfolio-section projects-section"
      aria-labelledby="projects-title"
    >
      <div className="portfolio-container">
        <SectionHeading
          id="projects-title"
          label="My Projects"
          title="Featured"
          accent="Projects"
          icon={HiOutlineRectangleStack}
          description="A selection of web applications, AI projects, and full-stack work."
        />
        <div
          className="project-filters"
          role="group"
          aria-label="Project categories"
        >
          {projectCategories.map((category) => {
            const Icon =
              category === "All Projects" ? null : categoryIcons[category]
            return (
              <button
                type="button"
                key={category}
                aria-pressed={selected === category}
                onClick={() => setSelected(category)}
              >
                {Icon && <Icon aria-hidden="true" />}
                {category}
              </button>
            )
          })}
        </div>
        <p className="sr-only" role="status">
          {visibleProjects.length}{" "}
          {visibleProjects.length === 1 ? "project" : "projects"} shown
        </p>
        <div className="projects-grid" key={selected}>
          {visibleProjects.map(
            ({
              name,
              category,
              description,
              stack,
              thumbnail: { src, width, height, crop },
              githubUrl,
              demoUrl,
            }) => (
              <article key={name} className="portfolio-card project-card">
                <div className="project-image">
                  <div
                    className="project-image-clip"
                    style={{
                      aspectRatio: crop
                        ? `${crop.width} / ${crop.height}`
                        : `${width} / ${height}`,
                    }}
                  >
                    <Image
                      src={src}
                      width={width}
                      height={height}
                      alt=""
                      unoptimized={Boolean(crop)}
                      sizes="(max-width: 680px) 92vw, (max-width: 900px) 45vw, 31vw"
                      style={
                        crop
                          ? {
                              width: `${(100 * width) / crop.width}%`,
                              left: `${(-100 * crop.x) / crop.width}%`,
                              top: `${(-100 * crop.y) / crop.height}%`,
                              transformOrigin: `${(100 * (crop.x + crop.width / 2)) / width}% ${(100 * (crop.y + crop.height / 2)) / height}%`,
                            }
                          : { width: "100%", left: 0, top: 0 }
                      }
                    />
                  </div>
                  <span className="project-category">{category}</span>
                </div>
                <div className="project-heading">
                  <h3>{name}</h3>
                  <div>
                    <ProjectAction
                      url={githubUrl}
                      title={`GitHub repository for ${name}`}
                      icon={FaGithub}
                    />
                    <ProjectAction
                      url={demoUrl}
                      title={`Live demo for ${name}`}
                      icon={HiOutlineArrowTopRightOnSquare}
                    />
                  </div>
                </div>
                <p>{description}</p>
                <ul className="project-stack" aria-label="Technology stack">
                  {stack.map((item) => (
                    <li key={item}>
                      <TechnologyIcon name={item} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          )}
        </div>
      </div>
      <Wave />
    </section>
  )
}
