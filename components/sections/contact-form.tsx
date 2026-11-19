"use client"

import { useState, type FormEvent } from "react"
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlineTag,
  HiOutlineUser,
} from "react-icons/hi2"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form
      className="contact-form portfolio-card"
      method="dialog"
      onSubmit={submit}
      onInput={() => setSubmitted(false)}
      aria-describedby="contact-form-note"
    >
      <div className="contact-form-header">
        <span className="icon-tile">
          <HiOutlineChatBubbleLeftRight aria-hidden="true" />
        </span>
        <div>
          <h3>Send a Message</h3>
          <p id="contact-form-note">
            Demo form. Messages aren’t sent or stored.
          </p>
        </div>
      </div>
      <div className="form-fields">
        <label>
          Your name <span aria-hidden="true">*</span>
          <span className="form-control">
            <HiOutlineUser aria-hidden="true" />
            <input
              name="name"
              autoComplete="name"
              placeholder="Enter your name"
              required
              maxLength={100}
            />
          </span>
        </label>
        <label>
          Your email <span aria-hidden="true">*</span>
          <span className="form-control">
            <HiOutlineEnvelope aria-hidden="true" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
              maxLength={254}
            />
          </span>
        </label>
        <label className="form-wide">
          Subject <span aria-hidden="true">*</span>
          <span className="form-control">
            <HiOutlineTag aria-hidden="true" />
            <input
              name="subject"
              placeholder="Enter the subject"
              required
              maxLength={150}
            />
          </span>
        </label>
        <label className="form-wide">
          Message <span aria-hidden="true">*</span>
          <span className="form-control">
            <HiOutlinePencilSquare aria-hidden="true" />
            <textarea
              name="message"
              placeholder="Write your message here"
              required
              rows={4}
              maxLength={3000}
            />
          </span>
        </label>
      </div>
      <Button
        className="portfolio-button portfolio-button--primary"
        type="submit"
      >
        <HiOutlinePaperAirplane aria-hidden="true" /> Send Message
      </Button>
      <div className="form-feedback" role="status">
        {submitted && "Demo complete. Your message was not sent."}
      </div>
    </form>
  )
}
