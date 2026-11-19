"use client"

import { useState, type FormEvent } from "react"
import {
  Brain,
  CodeXml,
  Database,
  Eye,
  GitBranch,
  Pencil,
  Plus,
  Search,
  Server,
  Star,
  Terminal,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  formatDate,
  projectCategories,
  type Collection,
  type RecordData,
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

const icons = {
  Code: CodeXml,
  Server,
  Database,
  Git: GitBranch,
  Brain,
  Terminal,
}
const configs: Record<
  Collection,
  {
    title: string
    singular: string
    description: string
    empty: Record<string, string>
    fields: Field[]
  }
> = {
  projects: {
    title: "Projects",
    singular: "project",
    description:
      "Curate your portfolio projects and choose which work to feature.",
    empty: {},
    fields: [
      { key: "title", label: "Project title", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: projectCategories,
        required: true,
      },
      { key: "image", label: "Thumbnail URL", placeholder: "https://…" },
      {
        key: "stack",
        label: "Technology stack",
        placeholder: "Next.js, Node.js, MongoDB",
      },
      { key: "github", label: "GitHub URL", type: "url" },
      { key: "demo", label: "Live demo URL", type: "url" },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        wide: true,
        required: true,
      },
      {
        key: "featured",
        label: "Featured project",
        type: "switch",
        wide: true,
      },
    ],
  },
  education: {
    title: "Education",
    singular: "education entry",
    description: "Manage your academic history and research interests.",
    empty: {},
    fields: [
      { key: "title", label: "Institution", required: true },
      { key: "degree", label: "Degree", required: true },
      { key: "department", label: "Department", wide: true },
      { key: "start", label: "Start date", type: "month" },
      { key: "end", label: "End date", type: "month" },
      {
        key: "current",
        label: "Currently studying",
        type: "switch",
        wide: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
      {
        key: "research",
        label: "Research interests",
        type: "textarea",
        wide: true,
      },
    ],
  },
  skills: {
    title: "Skills",
    singular: "skill",
    description:
      "Group, order, and control the visibility of your technical skills.",
    empty: { order: "0", visible: "true", icon: "Code" },
    fields: [
      { key: "title", label: "Skill name", required: true },
      { key: "category", label: "Category", type: "select", required: true },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        options: Object.keys(icons),
        required: true,
      },
      { key: "order", label: "Display order", type: "number", required: true },
      { key: "visible", label: "Visible on site", type: "switch", wide: true },
    ],
  },
  certifications: {
    title: "Certifications",
    singular: "certification",
    description: "Manage credentials, verification links, and visibility.",
    empty: { visible: "true" },
    fields: [
      { key: "title", label: "Certificate name", required: true },
      { key: "issuer", label: "Issuing organization", required: true },
      { key: "date", label: "Issue date", type: "date" },
      { key: "credential", label: "Credential ID" },
      {
        key: "image",
        label: "Certificate image URL",
        placeholder: "https://…",
      },
      { key: "verification", label: "Verification URL", type: "url" },
      { key: "visible", label: "Visible on site", type: "switch", wide: true },
    ],
  },
}

export function CollectionManager({
  collection,
  find,
  create,
}: {
  collection: Collection
  find: string
  create: boolean
}) {
  const { records, skillCategories } = useAdmin()
  const config = configs[collection]
  const fields = config.fields.map((field) =>
    collection === "skills" && field.key === "category"
      ? { ...field, options: skillCategories }
      : field
  )
  const [query, setQuery] = useState(find)
  const [editor, setEditor] = useState<RecordData | null>(
    create ? { id: "", values: config.empty } : null
  )
  const [preview, setPreview] = useState<RecordData | null>(null)
  const [remove, setRemove] = useState<RecordData | null>(null)
  const [categories, setCategories] = useState(false)
  const entries = records[collection].filter(({ values }) =>
    Object.values(values)
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  )

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor) return
    const values = Object.fromEntries(
      Object.entries(editor.values).map(([key, value]) => [key, value.trim()])
    )
    if (fields.some((field) => field.required && !values[field.key])) {
      toast.error("Fill in all required fields.")
      return
    }
    const imageField = fields.find((field) => field.key === "image")
    if (imageField && values.image && !safeUrl(values.image)) {
      toast.error("Enter a valid image URL.")
      return
    }
    if (
      fields.some(
        (field) =>
          field.type === "url" &&
          values[field.key] &&
          !safeUrl(values[field.key])
      )
    ) {
      toast.error("Use an HTTP or HTTPS link.")
      return
    }
    if (collection === "education") {
      if (values.current === "true") values.end = ""
      if (values.start && values.end && values.end < values.start) {
        toast.error("End date must be on or after the start date.")
        return
      }
    }
    const record = { id: editor.id || crypto.randomUUID(), values }
    const successful = saveDemo(
      (data) => ({
        ...data,
        records: {
          ...data.records,
          [collection]: editor.id
            ? data.records[collection].map((item) =>
                item.id === record.id ? record : item
              )
            : [record, ...data.records[collection]],
        },
      }),
      editor.id ? "Changes saved in this browser" : "Item added to the demo",
      {
        title: editor.id
          ? `Updated a ${config.singular}`
          : `Added a ${config.singular}`,
        detail: values.title,
        section: collection,
      }
    )
    if (successful) {
      setEditor(null)
      if (!editor.id) setQuery("")
    }
  }

  function table(rows: RecordData[], category?: string) {
    return (
      <div className="admin-card">
        {category && (
          <div className="admin-table-caption">
            <h2>{category}</h2>
            <Badge>{rows.length}</Badge>
          </div>
        )}
        {rows.length ? (
          <div
            className="admin-table-scroll"
            tabIndex={0}
            role="region"
            aria-label={category ?? `${config.title} table`}
          >
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">
                    {collection === "education" ? "Institution" : "Name"}
                  </th>
                  <th scope="col">
                    {collection === "projects"
                      ? "Category"
                      : collection === "education"
                        ? "Degree"
                        : collection === "skills"
                          ? "Display order"
                          : "Issuer"}
                  </th>
                  <th scope="col">
                    {collection === "projects"
                      ? "Tech stack"
                      : collection === "education"
                        ? "Dates"
                        : collection === "skills"
                          ? "Icon"
                          : "Issue date"}
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((record) => {
                  const v = record.values
                  const icon = icons[v.icon as keyof typeof icons]
                  const SkillIcon = icon ?? CodeXml
                  return (
                    <tr key={record.id}>
                      <th scope="row">
                        <span className="admin-name">
                          {(collection === "projects" ||
                            collection === "certifications") && (
                            <Thumbnail src={v.image} />
                          )}
                          {collection === "skills" && (
                            <span className="admin-metric-icon blue">
                              <SkillIcon size={17} />
                            </span>
                          )}
                          <span>{v.title}</span>
                        </span>
                      </th>
                      <td>
                        {collection === "projects"
                          ? v.category
                          : collection === "education"
                            ? v.degree
                            : collection === "skills"
                              ? v.order
                              : v.issuer}
                      </td>
                      <td>
                        {collection === "projects"
                          ? v.stack || "—"
                          : collection === "education"
                            ? [
                                v.start,
                                v.current === "true" ? "Present" : v.end,
                              ]
                                .filter(Boolean)
                                .join(" – ") || "—"
                            : collection === "skills"
                              ? v.icon
                              : formatDate(v.date)}
                      </td>
                      <td>
                        {collection === "projects" ? (
                          <Badge
                            tone={v.featured === "true" ? "blue" : "neutral"}
                          >
                            {v.featured === "true" ? "Featured" : "Standard"}
                          </Badge>
                        ) : collection === "education" ? (
                          <Badge
                            tone={v.current === "true" ? "green" : "neutral"}
                          >
                            {v.current === "true"
                              ? "Current"
                              : v.end
                                ? "Completed"
                                : "—"}
                          </Badge>
                        ) : (
                          <Badge
                            tone={v.visible === "true" ? "green" : "neutral"}
                          >
                            {v.visible === "true" ? "Visible" : "Hidden"}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <RowActions
                          label={v.title}
                          actions={[
                            {
                              name: "Preview",
                              icon: Eye,
                              run: () => setPreview(record),
                            },
                            {
                              name: "Edit",
                              icon: Pencil,
                              run: () => setEditor(record),
                            },
                            ...(collection === "projects"
                              ? [
                                  {
                                    name:
                                      v.featured === "true"
                                        ? "Unfeature"
                                        : "Feature",
                                    icon: Star,
                                    run: () =>
                                      saveDemo(
                                        (data) => ({
                                          ...data,
                                          records: {
                                            ...data.records,
                                            projects: data.records.projects.map(
                                              (item) =>
                                                item.id === record.id
                                                  ? {
                                                      ...item,
                                                      values: {
                                                        ...item.values,
                                                        featured: String(
                                                          item.values
                                                            .featured !== "true"
                                                        ),
                                                      },
                                                    }
                                                  : item
                                            ),
                                          },
                                        }),
                                        v.featured === "true"
                                          ? "Project unfeatured"
                                          : "Project featured"
                                      ),
                                  },
                                ]
                              : []),
                            {
                              name: "Delete",
                              icon: Trash2,
                              danger: true,
                              run: () => setRemove(record),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No items yet"
            detail="Add an item to this category to see it here."
          />
        )}
      </div>
    )
  }

  return (
    <div className="admin-stack">
      <Heading title={config.title} description={config.description}>
        <div className="admin-actions">
          {collection === "skills" && (
            <Button variant="outline" onClick={() => setCategories(true)}>
              Manage categories
            </Button>
          )}
          <Button onClick={() => setEditor({ id: "", values: config.empty })}>
            <Plus size={17} /> Add {config.singular}
          </Button>
        </div>
      </Heading>
      <div className="admin-toolbar">
        <div className="admin-search-field">
          <Search size={16} />
          <Input
            aria-label={`Search ${config.title.toLowerCase()}`}
            placeholder={`Search ${config.title.toLowerCase()}…`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <span>
          {entries.length} {entries.length === 1 ? "item" : "items"}
        </span>
      </div>
      {!entries.length && query ? (
        <div className="admin-card">
          <Empty />
        </div>
      ) : collection === "skills" ? (
        skillCategories.map((category) => {
          const items = entries
            .filter(({ values }) => values.category === category)
            .sort((a, b) => Number(a.values.order) - Number(b.values.order))
          return query && !items.length ? null : (
            <div key={category}>{table(items, category)}</div>
          )
        })
      ) : (
        table(entries)
      )}
      <Modal
        wide
        title={`${editor?.id ? "Edit" : "Add"} ${config.singular}`}
        description="Changes are saved to this browser’s demo workspace."
        open={!!editor}
        onClose={() => setEditor(null)}
      >
        {editor && (
          <form onSubmit={save}>
            <Fields
              fields={fields.filter(
                (field) =>
                  !(
                    collection === "education" &&
                    field.key === "end" &&
                    editor.values.current === "true"
                  )
              )}
              values={editor.values}
              onChange={(key, value) =>
                setEditor({
                  ...editor,
                  values: { ...editor.values, [key]: value },
                })
              }
            />
            <div className="admin-actions end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditor(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        wide
        title={preview?.values.title ?? "Preview"}
        description={`Preview this ${config.singular} as recorded in the demo.`}
        open={!!preview}
        onClose={() => setPreview(null)}
      >
        {preview && (
          <dl className="admin-detail">
            {fields
              .filter(({ key }) => key !== "title")
              .map(({ key, label, type }) => {
                const value = preview.values[key]
                const url = safeUrl(value)
                return (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>
                      {key === "image" && url ? (
                        <Thumbnail src={url} />
                      ) : type === "url" && url ? (
                        <a href={url} target="_blank" rel="noreferrer">
                          {url}
                        </a>
                      ) : type === "switch" ? (
                        value === "true" ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : (
                        value || "—"
                      )}
                    </dd>
                  </div>
                )
              })}
          </dl>
        )}
      </Modal>
      <Confirm
        title={`Delete ${config.singular}?`}
        description={`“${remove?.values.title ?? ""}” will be removed from this browser’s demo.`}
        open={!!remove}
        onClose={() => setRemove(null)}
        onConfirm={() => {
          if (
            remove &&
            saveDemo(
              (data) => ({
                ...data,
                records: {
                  ...data.records,
                  [collection]: data.records[collection].filter(
                    (item) => item.id !== remove.id
                  ),
                },
              }),
              "Item deleted"
            )
          )
            setRemove(null)
        }}
      />
      {categories && <Categories close={() => setCategories(false)} />}
    </div>
  )
}

function Categories({ close }: { close: () => void }) {
  const { skillCategories, records } = useAdmin()
  const [name, setName] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const [remove, setRemove] = useState("")
  function submit(event: FormEvent) {
    event.preventDefault()
    const next = name.trim()
    if (
      !next ||
      skillCategories.some(
        (item) => item !== editing && item.toLowerCase() === next.toLowerCase()
      )
    ) {
      toast.error("Enter a unique category name.")
      return
    }
    if (
      saveDemo(
        (data) => ({
          ...data,
          skillCategories: editing
            ? data.skillCategories.map((item) =>
                item === editing ? next : item
              )
            : [...data.skillCategories, next],
          records: {
            ...data.records,
            skills: editing
              ? data.records.skills.map((item) =>
                  item.values.category === editing
                    ? { ...item, values: { ...item.values, category: next } }
                    : item
                )
              : data.records.skills,
          },
        }),
        editing ? "Category renamed" : "Category added"
      )
    ) {
      setName("")
      setEditing(null)
    }
  }
  return (
    <>
      <Modal
        open={!remove}
        onClose={close}
        title="Manage skill categories"
        description="Rename categories or remove empty ones. Renaming also moves their skills."
      >
        <form onSubmit={submit} className="admin-actions category-form">
          <Input
            aria-label="Category name"
            maxLength={75}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Category name"
          />
          <Button type="submit">{editing ? "Rename" : "Add category"}</Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null)
                setName("")
              }}
            >
              Cancel
            </Button>
          )}
        </form>
        <div className="admin-list">
          {skillCategories.map((category) => (
            <div key={category}>
              <span>
                {category}
                <small>
                  {
                    records.skills.filter(
                      (item) => item.values.category === category
                    ).length
                  }{" "}
                  skills
                </small>
              </span>
              <RowActions
                label={category}
                actions={[
                  {
                    name: "Rename",
                    icon: Pencil,
                    run: () => {
                      setName(category)
                      setEditing(category)
                    },
                  },
                  {
                    name: "Delete",
                    icon: Trash2,
                    danger: true,
                    run: () =>
                      records.skills.some(
                        (item) => item.values.category === category
                      )
                        ? toast.error(
                            "Move or delete this category’s skills first."
                          )
                        : setRemove(category),
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </Modal>
      <Confirm
        open={!!remove}
        onClose={() => setRemove("")}
        title="Delete skill category?"
        description={`“${remove}” will be removed from this browser’s demo.`}
        onConfirm={() => {
          if (
            saveDemo(
              (data) => ({
                ...data,
                skillCategories: data.skillCategories.filter(
                  (value) => value !== remove
                ),
              }),
              "Category deleted"
            )
          ) {
            if (editing === remove) {
              setEditing(null)
              setName("")
            }
            setRemove("")
          }
        }}
      />
    </>
  )
}
