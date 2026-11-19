import {
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from "react-icons/hi2"
import { SectionHeading, SocialLinks } from "@/components/shared/portfolio-ui"
import { ContactForm } from "@/components/sections/contact-form"
import { profile } from "@/data/portfolio"

export function ContactSection() {
  return (
    <section
      id="contact"
      className="portfolio-section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="portfolio-container">
        <SectionHeading
          id="contact-title"
          label="Contact Me"
          title="Get in"
          accent="Touch"
          icon={HiOutlineEnvelope}
          description="Have a project, an opportunity, or a question? I’d like to hear from you."
        />
        <div className="contact-layout">
          <div className="contact-details" data-reveal>
            <h3>
              Let’s <span>Connect</span>
            </h3>
            <p>I’m open to collaborating on web development and AI projects.</p>
            <dl>
              <div>
                <span className="icon-tile">
                  <HiOutlineEnvelope aria-hidden="true" />
                </span>
                <div>
                  <dt>Email</dt>
                  <dd>
                    {profile.email ? (
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    ) : (
                      "Public email coming soon"
                    )}
                  </dd>
                </div>
              </div>
              <div>
                <span className="icon-tile">
                  <HiOutlineMapPin aria-hidden="true" />
                </span>
                <div>
                  <dt>Location</dt>
                  <dd>{profile.location}</dd>
                </div>
              </div>
              <div>
                <span className="icon-tile">
                  <HiOutlineBriefcase aria-hidden="true" />
                </span>
                <div>
                  <dt>Open to</dt>
                  <dd>{profile.openTo}</dd>
                </div>
              </div>
            </dl>
            <div className="contact-socials">
              <h4>Find Me On</h4>
              <SocialLinks />
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
