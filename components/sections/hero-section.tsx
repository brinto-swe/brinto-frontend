import type { CSSProperties } from "react"
import Image from "next/image"
import {
  HiOutlineArrowDownTray,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlinePause,
  HiOutlinePlay,
} from "react-icons/hi2"
import { SocialLinks, Wave } from "@/components/shared/portfolio-ui"
import { portraits, profile, researchAreas, statistics } from "@/data/portfolio"

export function HeroSection() {
  return (
    <section id="home" className="portfolio-hero" aria-labelledby="hero-title">
      <div className="portfolio-container hero-grid">
        <div className="hero-copy">
          {profile.available && (
            <p className="availability">
              <span aria-hidden="true" /> Available for Collaboration
            </p>
          )}
          <h1 id="hero-title">
            <span className="hero-intro">Hi, I’m</span>
            <span className="hero-name">
              {profile.name} <small>({profile.nickname})</small>
            </span>
          </h1>
          <ul className="hero-roles" aria-label="Professional roles">
            {profile.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <p className="hero-summary">
            I build intelligent, scalable, and user-centric software solutions.
            <br />
            Currently pursuing my Master of Engineering at Yangzhou University,
            with a research focus on <strong>{researchAreas[0]}</strong>,{" "}
            <strong>{researchAreas[1]}</strong>, and{" "}
            <strong>{researchAreas[2]}</strong>.
          </p>
          <div className="hero-actions">
            {profile.resumeUrl ? (
              <a
                className="portfolio-button portfolio-button--primary"
                href={profile.resumeUrl}
                download
              >
                <HiOutlineArrowDownTray aria-hidden="true" /> Download Resume
              </a>
            ) : (
              <button
                className="portfolio-button portfolio-button--primary"
                type="button"
                disabled
                title="Resume file pending"
              >
                <HiOutlineArrowDownTray aria-hidden="true" /> Download Resume
              </button>
            )}
            {profile.cvUrl ? (
              <a
                className="portfolio-button portfolio-button--outline"
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
              >
                <HiOutlineDocumentText aria-hidden="true" /> View CV
              </a>
            ) : (
              <button
                className="portfolio-button portfolio-button--outline"
                type="button"
                disabled
                title="CV file pending"
              >
                <HiOutlineDocumentText aria-hidden="true" /> View CV
              </button>
            )}
          </div>
          <SocialLinks />
          <dl className="hero-stats">
            {statistics.map(({ value, label }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="portrait-stage">
          <input
            className="portrait-pause sr-only"
            type="checkbox"
            id="pause-portraits"
            aria-label="Pause portrait rotation"
          />
          <div
            className="portrait-stack"
            role="img"
            aria-label="Portraits of K M Mozaddedul Islam"
          >
            {portraits.map(({ file, width, height, center }, index) => (
              <div
                className="portrait-slide"
                key={file}
                style={
                  {
                    "--portrait-position": center,
                    "--portrait-delay": `${index * 6}s`,
                  } as CSSProperties
                }
              >
                <Image
                  src={`/${encodeURIComponent(file)}`}
                  width={width}
                  height={height}
                  alt=""
                  preload={index === 0}
                  sizes="(max-width: 680px) 750px, (max-width: 1000px) 900px, 1150px"
                />
              </div>
            ))}
          </div>
          <label
            className="portrait-control"
            htmlFor="pause-portraits"
            title="Pause or resume portrait rotation"
          >
            <HiOutlinePause className="pause-icon" aria-hidden="true" />
            <HiOutlinePlay className="play-icon" aria-hidden="true" />
          </label>
        </div>
        <a href="#about" className="hero-scroll">
          <span className="scroll-mouse" aria-hidden="true" />
          Scroll to explore
          <HiOutlineChevronDown aria-hidden="true" />
        </a>
      </div>
      <Wave className="hero-wave" />
    </section>
  )
}
