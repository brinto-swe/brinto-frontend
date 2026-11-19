"use client"

import { useId, type ReactNode } from "react"
import { FolderOpen, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export { Button }
export type Field = {
  key: string
  label: string
  type?:
    | "text"
    | "textarea"
    | "select"
    | "switch"
    | "date"
    | "month"
    | "number"
    | "url"
    | "email"
  required?: boolean
  options?: readonly string[]
  wide?: boolean
  placeholder?: string
}

export function safeUrl(value: string | undefined) {
  if (!value) return undefined
  if (/^\/(?![/\\])[^\\]*$/.test(value)) return value
  try {
    const url = new URL(value)
    if (url.protocol === "https:" || url.protocol === "http:") return url.href
  } catch {}
}

export function Heading({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  )
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "blue" | "green" | "amber"
}) {
  return <span className={`admin-badge ${tone}`}>{children}</span>
}

export function Thumbnail({ src }: { src?: string }) {
  const url = safeUrl(src)
  return (
    <span className="admin-thumbnail">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- Demo image URLs are entered by the user.
        <img src={url} alt="" loading="lazy" referrerPolicy="no-referrer" />
      ) : (
        <ImageIcon size={18} />
      )}
    </span>
  )
}

export function Empty({
  title = "No results found",
  detail = "Try a different search or change your filters.",
}: {
  title?: string
  detail?: string
}) {
  return (
    <div className="admin-empty">
      <FolderOpen size={24} />
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  )
}

export function Modal({
  title,
  description,
  open,
  onClose,
  children,
  wide,
}: {
  title: string
  description: string
  open: boolean
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose()
      }}
    >
      <DialogContent
        className={`admin-surface admin-modal ${wide ? "admin-modal-wide" : ""}`}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function Confirm({
  title,
  description,
  open,
  onClose,
  onConfirm,
  confirmLabel = "Delete",
  pending = false,
  error,
}: {
  title: string
  description: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmLabel?: string
  pending?: boolean
  error?: string
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !pending) onClose()
      }}
    >
      <AlertDialogContent className="admin-surface admin-modal">
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        {error && <p className="admin-delete" role="alert">{error}</p>}
        <div className="admin-actions end">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function Fields({
  fields,
  values,
  onChange,
}: {
  fields: readonly Field[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  const prefix = useId()
  return (
    <div className="admin-fields">
      {fields.map(
        ({
          key,
          label,
          type = "text",
          required,
          options,
          wide,
          placeholder,
        }) => {
          const id = `${prefix}-${key}`
          const value = values[key] ?? ""
          const props = {
            id,
            value,
            required,
            onChange: (
              event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => onChange(key, event.target.value),
          }
          return (
            <div
              key={key}
              className={`admin-field ${wide ? "wide" : ""} ${type === "switch" ? "toggle" : ""}`}
            >
              <label htmlFor={id}>
                {label}
                {required && <span aria-hidden="true"> *</span>}
              </label>
              {type === "textarea" ? (
                <Textarea {...props} rows={4} placeholder={placeholder} />
              ) : type === "select" ? (
                <select {...props}>
                  <option value="" disabled>
                    Select an option
                  </option>
                  {options?.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              ) : type === "switch" ? (
                <Switch
                  id={id}
                  checked={value === "true"}
                  onCheckedChange={(checked) => onChange(key, String(checked))}
                />
              ) : (
                <Input
                  {...props}
                  type={type}
                  min={type === "number" ? 0 : undefined}
                  placeholder={placeholder}
                />
              )}
            </div>
          )
        }
      )}
    </div>
  )
}

export function RowActions({
  label,
  actions,
}: {
  label: string
  actions: {
    name: string
    icon: typeof ImageIcon
    run: () => void
    danger?: boolean
  }[]
}) {
  return (
    <div className="admin-actions row-actions">
      {actions.map(({ name, icon: Icon, run, danger }) => (
        <Button
          key={name}
          variant="ghost"
          size="icon-sm"
          className={danger ? "admin-delete" : ""}
          title={name}
          aria-label={`${name} ${label}`}
          onClick={run}
        >
          <Icon size={16} />
        </Button>
      ))}
    </div>
  )
}
