"use client"

import { useRef, useState, type FormEvent } from "react"
import {
  Download,
  Eye,
  FileText,
  Mail,
  MailOpen,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "sonner"
import {
  formatDate,
  today,
  type DocumentKind,
  type Message,
} from "./data"
import { saveDemo, useAdmin } from "./store"
import {
  Badge,
  Button,
  Confirm,
  Empty,
  Fields,
  Heading,
  Modal,
  RowActions,
  Thumbnail,
  safeUrl,
  type Field,
} from "./ui"

export function Messages({ find }: { find: string }) {
  const { messages } = useAdmin()
  const [query, setQuery] = useState(find)
  const [status, setStatus] = useState("")
  const [selection, select] = useState<string | null>(null)
  const [remove, setRemove] = useState<Message | null>(null)
  const active = messages.find((message) => message.id === selection)
  const visible = messages.filter(
    (message) =>
      (!status || (status === "read") === message.read) &&
      [message.name, message.email, message.subject, message.body]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  )

  function mark(message: Message, read: boolean) {
    return saveDemo(
      (data) => ({
        ...data,
        messages: data.messages.map((item) =>
          item.id === message.id ? { ...item, read } : item
        ),
      }),
      `Message marked as ${read ? "read" : "unread"}`
    )
  }
  return (
    <div className="admin-stack">
      <Heading
        title="Messages"
        description="Review and organize sample enquiries from your contact form."
      />
      <div className="admin-toolbar">
        <div className="admin-search-field">
          <Search size={16} />
          <Input
            aria-label="Search messages"
            placeholder="Search messages…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter messages"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <Badge tone="blue">
          {messages.filter((message) => !message.read).length} unread
        </Badge>
      </div>
      <div className="admin-card">
        {visible.length ? (
          <div
            className="admin-table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Messages table"
          >
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Sender</th>
                  <th scope="col">Message</th>
                  <th scope="col">Received</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((message) => (
                  <tr key={message.id}>
                    <th scope="row">
                      <span className="admin-name">
                        <span className="admin-metric-icon blue">
                          {message.name.slice(0, 1)}
                        </span>
                        <span>
                          {message.name}
                          <small>{message.email}</small>
                        </span>
                      </span>
                    </th>
                    <td>
                      <strong>{message.subject}</strong>
                      <small className="admin-message-snippet">
                        {message.body}
                      </small>
                    </td>
                    <td>{formatDate(message.date)}</td>
                    <td>
                      <Badge tone={message.read ? "neutral" : "blue"}>
                        {message.read ? "Read" : "Unread"}
                      </Badge>
                    </td>
                    <td>
                      <RowActions
                        label={message.subject}
                        actions={[
                          {
                            name: "View",
                            icon: Eye,
                            run: () => {
                              select(message.id)
                              if (!message.read) mark(message, true)
                            },
                          },
                          {
                            name: message.read ? "Mark unread" : "Mark read",
                            icon: message.read ? Mail : MailOpen,
                            run: () => mark(message, !message.read),
                          },
                          {
                            name: "Delete",
                            icon: Trash2,
                            danger: true,
                            run: () => setRemove(message),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title={
              query || status ? "No matching messages" : "Your inbox is empty"
            }
            detail={
              query || status
                ? "Try another search or filter."
                : "Sample enquiries will appear here."
            }
          />
        )}
      </div>
      <Modal
        open={!!active}
        onClose={() => select(null)}
        title={active?.subject ?? "Message"}
        description={
          active
            ? `From ${active.name} · ${formatDate(active.date)}`
            : "Sample contact message"
        }
      >
        {active && (
          <>
            <dl className="admin-detail">
              <div>
                <dt>Email</dt>
                <dd>{active.email}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{active.body}</dd>
              </div>
            </dl>
            <div className="admin-actions end">
              <Button
                variant="outline"
                onClick={() => mark(active, !active.read)}
              >
                {active.read ? "Mark as unread" : "Mark as read"}
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Confirm
        open={!!remove}
        onClose={() => setRemove(null)}
        title="Delete message?"
        description={`“${remove?.subject ?? ""}” will be removed from this browser’s demo.`}
        onConfirm={() => {
          if (
            remove &&
            saveDemo(
              (data) => ({
                ...data,
                messages: data.messages.filter((item) => item.id !== remove.id),
              }),
              "Message deleted"
            )
          )
            setRemove(null)
        }}
      />
    </div>
  )
}

const documentLabels = { resume: "Resume", cv: "CV" }
const maxDocumentSize = 1024 * 1024
export function Documents() {
  const { documents } = useAdmin()
  const [remove, setRemove] = useState<DocumentKind | null>(null)
  const [preview, setPreview] = useState<DocumentKind | null>(null)
  const [loading, setLoading] = useState<DocumentKind | null>(null)
  const resumeInput = useRef<HTMLInputElement>(null)
  const cvInput = useRef<HTMLInputElement>(null)
  const active = preview ? documents[preview] : null

  async function upload(file: File, kind: DocumentKind) {
    setLoading(kind)
    try {
      if (
        !/\.pdf$/i.test(file.name) ||
        (await file.slice(0, 5).text()) !== "%PDF-"
      ) {
        toast.error("Choose a valid PDF file.")
        return
      }
      if (file.size > maxDocumentSize) {
        toast.error("Choose a PDF smaller than 1 MB.")
        return
      }
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(
                reader.result.replace(/^data:[^;]*;/, "data:application/pdf;")
              )
            : reject()
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      saveDemo(
        (state) => ({
          ...state,
          documents: {
            ...state.documents,
            [kind]: { name: file.name, size: file.size, date: today(), data },
          },
        }),
        `${documentLabels[kind]} saved in this browser`
      )
    } catch {
      toast.error("Could not read that PDF. Try another file.")
    } finally {
      setLoading(null)
    }
  }
  return (
    <div className="admin-stack">
      <Heading
        title="Resume & CV"
        description="Manage downloadable documents in this browser’s demo."
      />
      <div className="admin-analytics even">
        {(["resume", "cv"] as const).map((kind) => {
          const file = documents[kind]
          const input = kind === "resume" ? resumeInput : cvInput
          const label = documentLabels[kind]
          return (
            <section key={kind} className="admin-card admin-form-card">
              <div className="admin-card-heading">
                <div>
                  <h2>{label}</h2>
                  <p>
                    {kind === "resume"
                      ? "A concise summary of your experience"
                      : "A detailed academic and professional record"}
                  </p>
                </div>
                <span className="admin-metric-icon blue">
                  <FileText size={20} />
                </span>
              </div>
              {file ? (
                <dl className="admin-detail">
                  <div>
                    <dt>File name</dt>
                    <dd>{file.name}</dd>
                  </div>
                  <div>
                    <dt>File type</dt>
                    <dd>PDF</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{(file.size / 1024).toFixed(1)} KB</dd>
                  </div>
                  <div>
                    <dt>Upload date</dt>
                    <dd>{formatDate(file.date)}</dd>
                  </div>
                </dl>
              ) : (
                <Empty
                  title={`No ${label} on file`}
                  detail="Choose a PDF to add it to this demo."
                />
              )}
              <input
                ref={input}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={(event) => {
                  const selected = event.target.files?.[0]
                  event.target.value = ""
                  if (selected) void upload(selected, kind)
                }}
              />
              <div className="admin-actions">
                <Button
                  disabled={!!loading}
                  onClick={() => input.current?.click()}
                >
                  <Upload size={15} />
                  {loading === kind
                    ? "Reading…"
                    : file
                      ? `Replace ${label}`
                      : `Upload ${label}`}
                </Button>
                {file && (
                  <>
                    <Button variant="outline" onClick={() => setPreview(kind)}>
                      <Eye size={16} /> Preview
                    </Button>
                    <a
                      href={file.data}
                      download={file.name}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <Download size={16} /> Download
                    </a>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="admin-delete"
                      aria-label={`Remove ${label}`}
                      onClick={() => setRemove(kind)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
              <p className="admin-note">PDF only, up to 1 MB per document.</p>
            </section>
          )
        })}
      </div>
      <Modal
        wide
        open={!!active}
        onClose={() => setPreview(null)}
        title={active?.name ?? "Preview PDF"}
        description="Document preview depends on your browser’s PDF viewer."
      >
        {active && (
          <>
            <object
              data={active.data}
              type="application/pdf"
              className="admin-pdf"
              aria-label={`Preview of ${active.name}`}
            >
              <p>
                Preview unavailable in this browser. Use Download to open the
                file.
              </p>
            </object>
            <div className="admin-actions end">
              <a
                href={active.data}
                download={active.name}
                className={buttonVariants({ variant: "outline" })}
              >
                <Download size={16} /> Download PDF
              </a>
            </div>
          </>
        )}
      </Modal>
      <Confirm
        title={`Remove ${remove ? documentLabels[remove] : "document"}?`}
        description="This file will be removed from this browser’s demo."
        confirmLabel="Remove"
        open={!!remove}
        onClose={() => setRemove(null)}
        onConfirm={() => {
          if (
            remove &&
            saveDemo(
              (data) => ({
                ...data,
                documents: { ...data.documents, [remove]: null },
              }),
              "Document removed"
            )
          )
            setRemove(null)
        }}
      />
    </div>
  )
}

const socials: Field[] = [
  "GitHub",
  "LinkedIn",
  "YouTube",
  "Medium",
  "X",
  "Website",
].map((label) => ({
  key: label.toLowerCase(),
  label: `${label} URL`,
  type: "url",
}))
const profileGroups: { title: string; description: string; fields: Field[] }[] =
  [
    {
      title: "Personal information",
      description: "Edit the identity displayed in this demo workspace.",
      fields: [
        {
          key: "photo",
          label: "Profile picture URL",
          wide: true,
          placeholder: "https://…",
        },
        { key: "name", label: "Full name", required: true },
        { key: "nickname", label: "Nickname", required: true },
        {
          key: "title",
          label: "Professional title",
          wide: true,
          required: true,
        },
        { key: "location", label: "Location" },
        { key: "email", label: "Email", type: "email" },
        { key: "bio", label: "Short biography", type: "textarea", wide: true },
        {
          key: "research",
          label: "Research interests",
          type: "textarea",
          wide: true,
        },
      ],
    },
    {
      title: "Social links",
      description: "Add the profiles you want associated with your work.",
      fields: socials,
    },
  ]
export function ProfileSettingsForm() {
  const { profile } = useAdmin()
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const values = draft ?? profile

  function submit(event: FormEvent) {
    event.preventDefault()
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    )
    const fields = profileGroups.flatMap((group) => group.fields)
    if (fields.some((field) => field.required && !cleaned[field.key])) {
      toast.error("Fill in all required fields.")
      return
    }
    if (
      fields.some(
        (field) =>
          (field.type === "url" || field.key === "photo") &&
          cleaned[field.key] &&
          !safeUrl(cleaned[field.key])
      )
    ) {
      toast.error("Enter valid HTTP or HTTPS URLs.")
      return
    }
    if (
      saveDemo(
        (data) => ({ ...data, profile: cleaned }),
        "Settings saved in this browser",
        {
          title: "Updated profile settings",
          detail: "Browser workspace",
          section: "profile",
        }
      )
    )
      setDraft(null)
  }

  return (
    <div className="admin-stack">
      <Heading
        title="Profile Settings"
        description="Edit your bio, contact details, and professional links."
      />
      <div className="admin-demo-notice">
        These settings apply to the demo workspace in this browser.
      </div>
      <form className="admin-stack" onSubmit={submit}>
        {profileGroups.map(({ title, description, fields }, index) => (
          <section className="admin-card admin-form-card" key={title}>
            <div className="admin-card-heading">
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              {index === 0 && <Thumbnail src={values.photo} />}
            </div>
            <Fields
              fields={fields}
              values={values}
              onChange={(key, value) => setDraft({ ...values, [key]: value })}
            />
          </section>
        ))}
        <div className="admin-actions end">
          <Button
            type="button"
            variant="outline"
            disabled={!draft}
            onClick={() => setDraft(null)}
          >
            Discard changes
          </Button>
          <Button type="submit" disabled={!draft}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}
