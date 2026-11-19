"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Fragment, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  CodeXml,
  Eye,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pencil,
  Plus,
  Quote,
  Search,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  blogCategories,
  blogStatuses,
  formatDate,
  today,
  type Blog,
  type BlogStatus,
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

const pageSize = 5
const statusBadge = (status: BlogStatus) => (
  <Badge
    tone={
      status === "Published"
        ? "green"
        : status === "Draft"
          ? "amber"
          : "neutral"
    }
  >
    {status}
  </Badge>
)
const titleOf = (blog: Blog) =>
  blog.en.title || blog.bn.title || "Untitled draft"

export function Blogs({ status: initialStatus }: { status: string }) {
  const { blogs } = useAdmin()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState(
    blogStatuses.includes(initialStatus as BlogStatus) ? initialStatus : ""
  )
  const [page, setPage] = useState(1)
  const [preview, setPreview] = useState<Blog | null>(null)
  const [remove, setRemove] = useState<Blog | null>(null)
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const filtered = blogs.filter(
    (post) =>
      (!category || post.category === category) &&
      (!status || post.status === status) &&
      [post.en.title, post.bn.title, post.author, post.tags]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  )
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pages)
  const first = (currentPage - 1) * pageSize

  return (
    <div className="admin-stack">
      <Heading
        title="Blogs"
        description="Manage bilingual articles, drafts, and publication status."
      >
        <Link href="/admin/blogs/new" className={buttonVariants()}>
          <Plus size={17} /> Create blog
        </Link>
      </Heading>
      <div className="admin-toolbar">
        <div className="admin-search-field">
          <Search size={16} />
          <Input
            aria-label="Search articles"
            placeholder="Search articles…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          aria-label="Filter articles by category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value)
            setPage(1)
          }}
        >
          <option value="">All categories</option>
          {blogCategories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label="Filter articles by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="">All statuses</option>
          {blogStatuses.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="admin-card">
        {filtered.length ? (
          <>
            <div
              className="admin-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Articles table"
            >
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Article</th>
                    <th scope="col">Category</th>
                    <th scope="col">Author</th>
                    <th scope="col">Publication date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(first, first + pageSize).map((blog) => (
                    <tr key={blog.id}>
                      <th scope="row">
                        <span className="admin-name">
                          <Thumbnail src={blog.cover} />
                          <span>
                            {blog.en.title || "Untitled draft"}
                            {blog.bn.title && (
                              <small lang="bn">{blog.bn.title}</small>
                            )}
                          </span>
                        </span>
                      </th>
                      <td>{blog.category || "—"}</td>
                      <td>{blog.author || "—"}</td>
                      <td>{formatDate(blog.date)}</td>
                      <td>{statusBadge(blog.status)}</td>
                      <td>
                        <RowActions
                          label={titleOf(blog)}
                          actions={[
                            {
                              name: "Preview",
                              icon: Eye,
                              run: () => {
                                setLanguage("en")
                                setPreview(blog)
                              },
                            },
                            {
                              name: "Edit",
                              icon: Pencil,
                              run: () =>
                                router.push(`/admin/blogs/${blog.id}/edit`),
                            },
                            {
                              name: "Delete",
                              icon: Trash2,
                              danger: true,
                              run: () => setRemove(blog),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              <span>
                Showing {first + 1}–
                {Math.min(first + pageSize, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="admin-actions">
                <Button
                  aria-label="Previous page"
                  variant="outline"
                  size="icon-sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ArrowLeft size={15} />
                </Button>
                <span>
                  {currentPage} / {pages}
                </span>
                <Button
                  aria-label="Next page"
                  variant="outline"
                  size="icon-sm"
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Empty
            title={
              query || category || status
                ? "No matching articles"
                : "No articles yet"
            }
            detail={
              query || category || status
                ? "Try another search or filter."
                : "Create your first blog post to get started."
            }
          />
        )}
      </div>
      <Modal
        wide
        title="Article preview"
        description="Preview the selected language in the admin demo."
        open={!!preview}
        onClose={() => setPreview(null)}
      >
        <LanguageTabs language={language} onChange={setLanguage} />
        {preview && <ArticlePreview blog={preview} language={language} />}
      </Modal>
      <Confirm
        title="Delete article?"
        description={`“${remove ? titleOf(remove) : ""}” and both translations will be removed from this demo.`}
        open={!!remove}
        onClose={() => setRemove(null)}
        onConfirm={() => {
          if (
            remove &&
            saveDemo(
              (state) => ({
                ...state,
                blogs: state.blogs.filter((blog) => blog.id !== remove.id),
              }),
              "Article deleted"
            )
          )
            setRemove(null)
        }}
      />
    </div>
  )
}

const metadata: Field[] = [
  {
    key: "cover",
    label: "Cover image URL",
    wide: true,
    placeholder: "https://…",
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: blogCategories,
  },
  { key: "status", label: "Status", type: "select", options: blogStatuses },
  { key: "author", label: "Author" },
  { key: "date", label: "Publication date", type: "date" },
  { key: "tags", label: "Tags", wide: true, placeholder: "AI, Research" },
]
const translations: Field[] = [
  { key: "title", label: "Headline", wide: true },
  { key: "excerpt", label: "Excerpt", type: "textarea", wide: true },
]
const blankLanguage = { title: "", excerpt: "", article: "" }
const blankBlog: Blog = {
  id: "",
  cover: "",
  category: "",
  author: "Brinto",
  date: "",
  tags: "",
  status: "Draft",
  en: blankLanguage,
  bn: blankLanguage,
}

function LanguageTabs({
  language,
  onChange,
}: {
  language: "en" | "bn"
  onChange: (language: "en" | "bn") => void
}) {
  return (
    <Tabs
      value={language}
      onValueChange={(value) => onChange(value === "bn" ? "bn" : "en")}
      aria-label="Article language"
    >
      <TabsList>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="bn" lang="bn">
          বাংলা
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

const formats = [
  {
    name: "Heading",
    icon: Heading2,
    before: "## ",
    after: "",
    sample: "Heading",
    line: true,
  },
  { name: "Bold", icon: Bold, before: "**", after: "**", sample: "bold text" },
  {
    name: "Italic",
    icon: Italic,
    before: "*",
    after: "*",
    sample: "italic text",
  },
  {
    name: "Bulleted list",
    icon: List,
    before: "- ",
    after: "\n- Another item",
    sample: "List item",
    line: true,
  },
  {
    name: "Numbered list",
    icon: ListOrdered,
    before: "1. ",
    after: "\n2. Another item",
    sample: "List item",
    line: true,
  },
  {
    name: "Link",
    icon: Link2,
    before: "[",
    after: "](https://example.com)",
    sample: "Link text",
  },
  {
    name: "Image with caption",
    icon: ImagePlus,
    before: "![",
    after: "](/blog/desk.webp)\nCaption: Image caption",
    sample: "Image description",
    line: true,
  },
  {
    name: "Quote",
    icon: Quote,
    before: "> ",
    after: "",
    sample: "Quote text",
    line: true,
  },
  {
    name: "Code block",
    icon: CodeXml,
    before: "```\n",
    after: "\n```",
    sample: "code",
    line: true,
  },
]

export function Editor({ id }: { id?: string }) {
  const { blogs, profile } = useAdmin()
  const stored = id
    ? blogs.find((blog) => blog.id === id)
    : { ...blankBlog, author: profile.nickname || "Brinto" }
  const router = useRouter()
  const [draft, setDraft] = useState<Blog | null>(null)
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [preview, setPreview] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const blog = draft ?? stored
  if (!blog)
    return (
      <div className="admin-card">
        <Empty
          title="Article unavailable"
          detail="This article may have been deleted or created in another browser."
        />
        <div className="admin-actions end">
          <Link href="/admin/blogs" className={buttonVariants()}>
            Back to blogs
          </Link>
        </div>
      </div>
    )
  const content = blog[language]

  function updateLanguage(key: string, value: string) {
    if (blog)
      setDraft({ ...blog, [language]: { ...blog[language], [key]: value } })
  }

  function insert(format: (typeof formats)[number]) {
    const area = editor.current
    if (!area) return
    const { selectionStart: start, selectionEnd: end, value } = area
    const preceding =
      format.line && start > 0 && !value.slice(0, start).endsWith("\n")
        ? "\n\n"
        : ""
    const following =
      format.line && end < value.length && !value.slice(end).startsWith("\n")
        ? "\n\n"
        : ""
    const selection = value.slice(start, end) || format.sample
    const next =
      value.slice(0, start) +
      preceding +
      format.before +
      selection +
      format.after +
      following +
      value.slice(end)
    updateLanguage("article", next)
    requestAnimationFrame(() => {
      area.focus()
      const from = start + preceding.length + format.before.length
      area.setSelectionRange(from, from + selection.length)
    })
  }

  function save(status: BlogStatus) {
    if (!blog) return
    if (blog.cover && !safeUrl(blog.cover.trim())) {
      toast.error("Enter a valid cover image URL.")
      return
    }
    if (status === "Published") {
      if (!blog.author.trim() || !blog.category) {
        toast.error("Choose a category and enter an author before publishing.")
        return
      }
      const missing = (["en", "bn"] as const).find((key) =>
        Object.values(blog[key]).some((value) => !value.trim())
      )
      if (missing) {
        setLanguage(missing)
        toast.error(
          `Complete the ${missing === "en" ? "English" : "Bangla"} headline, excerpt, and article before publishing.`
        )
        return
      }
    }
    const post: Blog = {
      ...blog,
      id: blog.id || crypto.randomUUID(),
      status,
      cover: blog.cover.trim(),
      date: status === "Published" ? blog.date || today() : blog.date,
    }
    if (
      saveDemo(
        (state) => ({
          ...state,
          blogs: id
            ? state.blogs.map((item) => (item.id === id ? post : item))
            : [post, ...state.blogs],
        }),
        status === "Published"
          ? "Article published in the demo"
          : status === "Archived"
            ? "Article archived"
            : "Draft saved in this browser",
        {
          section: "blogs",
          title:
            status === "Published"
              ? "Published an article"
              : status === "Archived"
                ? "Archived an article"
                : "Saved an article draft",
          detail: titleOf(post),
        }
      )
    )
      router.push("/admin/blogs")
  }

  return (
    <div className="admin-stack">
      <Link href="/admin/blogs" className="admin-back">
        <ArrowLeft size={16} /> Back to blogs
      </Link>
      <Heading
        title={id ? "Edit blog post" : "Create blog post"}
        description="English and Bangla share one article and publication status."
      >
        <div className="admin-actions">
          <Button variant="outline" onClick={() => setPreview(true)}>
            <Eye size={17} /> Preview
          </Button>
          <Button variant="outline" onClick={() => save("Draft")}>
            Save draft
          </Button>
          <Button onClick={() => save("Published")}>Publish</Button>
          {(id || blog.status === "Archived") && (
            <Button variant="outline" onClick={() => save("Archived")}>
              {blog.status === "Archived" ? "Save as archived" : "Archive article"}
            </Button>
          )}
        </div>
      </Heading>
      <div className="admin-editor-grid">
        <section className="admin-card admin-form-card">
          <div className="admin-card-heading">
            <div>
              <h2>Article content</h2>
              <p>Use the formatting toolbar or enter Markdown directly.</p>
            </div>
          </div>
          <LanguageTabs language={language} onChange={setLanguage} />
          <div className="admin-language-content" lang={language}>
            <Fields
              fields={translations}
              values={content}
              onChange={updateLanguage}
            />
            <label htmlFor="admin-article-body">Full article</label>
            <div
              role="group"
              aria-label="Article formatting"
              className="admin-formatting"
            >
              {formats.map((format) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  key={format.name}
                  title={format.name}
                  aria-label={format.name}
                  onClick={() => insert(format)}
                >
                  <format.icon size={16} />
                </Button>
              ))}
            </div>
            <Textarea
              ref={editor}
              id="admin-article-body"
              value={content.article}
              onChange={(event) =>
                updateLanguage("article", event.target.value)
              }
              rows={15}
              placeholder={
                language === "en"
                  ? "Write the English article…"
                  : "বাংলা নিবন্ধ লিখুন…"
              }
            />
          </div>
        </section>
        <section className="admin-card admin-form-card admin-editor-settings">
          <div className="admin-card-heading">
            <div>
              <h2>Article settings</h2>
              <p>Shared across both translations</p>
            </div>
          </div>
          {blog.cover && <Thumbnail src={blog.cover} />}
          <Fields
            fields={metadata}
            values={Object.fromEntries(
              Object.entries(blog).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === "string"
              )
            )}
            onChange={(key, value) => setDraft({ ...blog, [key]: value })}
          />
        </section>
      </div>
      <Modal
        wide
        title="Article preview"
        description="Preview the active translation before saving."
        open={preview}
        onClose={() => setPreview(false)}
      >
        <LanguageTabs language={language} onChange={setLanguage} />
        <ArticlePreview blog={blog} language={language} />
      </Modal>
    </div>
  )
}

function inline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
        return <strong key={index}>{part.slice(2, -2)}</strong>
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
        return <em key={index}>{part.slice(1, -1)}</em>
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      const href = safeUrl(link?.[2])
      return link && href ? (
        <a key={index} href={href} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      )
    })
}

function ArticlePreview({
  blog,
  language,
}: {
  blog: Blog
  language: "en" | "bn"
}) {
  const { title, excerpt, article } = blog[language]
  const lines = article.split(/\r?\n/)
  const blocks = []
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line.trim()) continue
    const key = index
    if (line.startsWith("```")) {
      const code = []
      while (index + 1 < lines.length && !lines[index + 1].startsWith("```"))
        code.push(lines[++index])
      if (index + 1 < lines.length) index++
      blocks.push(
        <pre key={key}>
          <code>{code.join("\n")}</code>
        </pre>
      )
    } else if (/^#{1,3} /.test(line)) {
      const HeadingTag = line.startsWith("###")
        ? "h5"
        : line.startsWith("##")
          ? "h4"
          : "h3"
      blocks.push(
        <HeadingTag key={key}>{inline(line.replace(/^#+ /, ""))}</HeadingTag>
      )
    } else if (line.startsWith("> ")) {
      blocks.push(<blockquote key={key}>{inline(line.slice(2))}</blockquote>)
    } else if (/^(- |\d+\. )/.test(line)) {
      const ListTag = line.startsWith("- ") ? "ul" : "ol"
      const matchList = ListTag === "ul" ? /^- / : /^\d+\. /
      const items = [line]
      while (index + 1 < lines.length && matchList.test(lines[index + 1]))
        items.push(lines[++index])
      blocks.push(
        <ListTag key={key}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{inline(item.replace(matchList, ""))}</li>
          ))}
        </ListTag>
      )
    } else {
      const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      const src = safeUrl(image?.[2])
      if (image && src) {
        const caption = lines[index + 1]?.startsWith("Caption: ")
          ? lines[++index].slice(9)
          : ""
        blocks.push(
          <figure key={key}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Article images accept user-provided URLs. */}
            <img
              src={src}
              alt={image[1]}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {caption && <figcaption>{inline(caption)}</figcaption>}
          </figure>
        )
      } else blocks.push(<p key={key}>{inline(line)}</p>)
    }
  }
  return (
    <article className="admin-article-preview" lang={language}>
      {blog.cover && <Thumbnail src={blog.cover} />}
      <div>
        {statusBadge(blog.status)}{" "}
        {blog.category && <Badge>{blog.category}</Badge>}
      </div>
      <h2>{title || "Untitled draft"}</h2>
      {excerpt && <p className="admin-excerpt">{excerpt}</p>}
      {blocks.length ? blocks : <p>No article content in this language yet.</p>}
    </article>
  )
}
