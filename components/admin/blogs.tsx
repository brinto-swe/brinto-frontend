"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ArticleContent } from "@/components/blog/article-content"
import { blogBengali } from "@/lib/blog-font"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  blogCategories,
  blogStatuses,
  formatDate,
  today,
  type Blog,
  type BlogTranslation,
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
  type Field,
} from "./ui"
import { StructuredEditor } from "./blog-structured-editor"
import { publishableTranslation } from "./blog-editor-model"
import { AdminImageUploader } from "./image-uploader"

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
      [
        post.en.title,
        post.bn.title,
        post.author,
        ...post.en.tags,
        ...post.bn.tags,
      ]
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
                          <BlogCover blog={blog} />
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
    key: "category",
    label: "Category",
    type: "select",
    options: blogCategories,
  },
  { key: "status", label: "Status", type: "select", options: blogStatuses },
  { key: "author", label: "Author" },
  { key: "date", label: "Publication date", type: "date" },
]
const translations: Field[] = [
  { key: "title", label: "Headline", wide: true },
  { key: "excerpt", label: "Excerpt", type: "textarea", wide: true },
  { key: "tags", label: "Tags", wide: true, placeholder: "AI, Research" },
]
const blankLanguage: BlogTranslation = {
  title: "",
  excerpt: "",
  tags: [],
  content: [],
}
const blankBlog: Blog = {
  id: "",
  cover: "",
  category: "",
  author: "Brinto",
  date: "",
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

const subscribeReady = () => () => {}

export function Editor({ id }: { id?: string }) {
  const ready = useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false
  )
  return ready ? (
    <BlogEditor id={id} />
  ) : (
    <p role="status">Loading article editor…</p>
  )
}

function BlogEditor({ id }: { id?: string }) {
  const { blogs, profile } = useAdmin()
  const stored = id
    ? blogs.find((blog) => blog.id === id)
    : { ...blankBlog, author: profile.nickname || "Brinto" }
  const router = useRouter()
  const [draft, setDraft] = useState<Blog | null>(null)
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [preview, setPreview] = useState(false)
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
  function updateTranslation(
    locale: "en" | "bn",
    update: (value: BlogTranslation) => BlogTranslation
  ) {
    setDraft((previous) => {
      const current = previous ?? blog
      return current ? { ...current, [locale]: update(current[locale]) } : null
    })
  }

  function save(status: BlogStatus) {
    if (!blog) return
    if (status === "Published") {
      if (!blog.author.trim() || !blog.category) {
        toast.error("Choose a category and enter an author before publishing.")
        return
      }
      const missing = (["en", "bn"] as const).find(
        (key) => !publishableTranslation(blog[key])
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
      en: prepareTranslationForSave(blog.en),
      bn: prepareTranslationForSave(blog.bn),
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
              {blog.status === "Archived"
                ? "Save as archived"
                : "Archive article"}
            </Button>
          )}
        </div>
      </Heading>
      <div className="admin-editor-grid">
        <section className="admin-card admin-form-card">
          <div className="admin-card-heading">
            <div>
              <h2>Article content</h2>
              <p>Select text within a block to apply formatting.</p>
            </div>
          </div>
          <LanguageTabs language={language} onChange={setLanguage} />
          {(["en", "bn"] as const).map((locale) => {
            const { title, excerpt, tags } = blog[locale]
            return (
              <div key={locale} hidden={locale !== language}>
                <div className="admin-language-content" lang={locale}>
                  <Fields
                    fields={translations}
                    values={{ title, excerpt, tags: tags.join(",") }}
                    onChange={(key, value) =>
                      updateTranslation(locale, (current) => ({
                        ...current,
                        [key]: key === "tags" ? value.split(",") : value,
                      }))
                    }
                  />
                  <StructuredEditor
                    translation={blog[locale]}
                    onChange={(update) => updateTranslation(locale, update)}
                  />
                </div>
              </div>
            )
          })}
        </section>
        <section className="admin-card admin-form-card admin-editor-settings">
          <div className="admin-card-heading">
            <div>
              <h2>Article settings</h2>
              <p>Shared across both translations</p>
            </div>
          </div>
          <div className="space-y-3">
            {!blog.coverAsset &&
              (blog.cover || blog.coverSprite !== undefined) && (
                <BlogCover blog={blog} />
              )}
            <label className="block">
              Cover sprite
              <select
                className="ms-2"
                value={blog.coverSprite ?? ""}
                onChange={(event) => {
                  const value = event.target.value
                  setDraft((previous) => ({
                    ...(previous ?? blog),
                    cover: "",
                    coverAsset: undefined,
                    coverSprite:
                      value === ""
                        ? undefined
                        : (Number(value) as Blog["coverSprite"]),
                  }))
                }}
              >
                <option value="">No sprite</option>
                {[0, 1, 2, 3, 4, 5].map((tile) => (
                  <option key={tile} value={tile}>
                    Cover {tile + 1}
                  </option>
                ))}
              </select>
            </label>
            {blog.cover && !blog.coverAsset && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setDraft((previous) => ({ ...(previous ?? blog), cover: "" }))
                }
              >
                Remove existing cover
              </Button>
            )}
            <AdminImageUploader
              purpose="blog-cover"
              value={blog.coverAsset ?? null}
              label="Cover image"
              onChange={(asset) =>
                setDraft((previous) => ({
                  ...(previous ?? blog),
                  cover: asset?.imageUrl ?? "",
                  coverSprite: undefined,
                  coverAsset: asset ?? undefined,
                }))
              }
            />
          </div>
          <Fields
            fields={metadata}
            values={Object.fromEntries(
              Object.entries(blog).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === "string"
              )
            )}
            onChange={(key, value) =>
              setDraft((previous) => ({ ...(previous ?? blog), [key]: value }))
            }
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

function prepareTranslationForSave(
  translation: BlogTranslation
): BlogTranslation {
  const urls = new Set(
    translation.content.flatMap((block) =>
      block.kind === "image" ? [block.src] : []
    )
  )
  return {
    ...translation,
    tags: [
      ...new Set(translation.tags.map((tag) => tag.trim()).filter(Boolean)),
    ],
    imageAssets: translation.imageAssets?.filter((asset) =>
      urls.has(asset.imageUrl)
    ),
  }
}

function BlogCover({ blog }: { blog: Blog }) {
  const tile = blog.coverSprite
  if (tile === undefined) return <Thumbnail src={blog.cover} />
  return (
    <span
      className="admin-thumbnail admin-blog-sprite"
      aria-label="Bundled cover"
      role="img"
      style={{
        backgroundPosition:
          (tile % 3) * 50 + "% " + (tile < 3 ? "12.5%" : "87.5%"),
      }}
    />
  )
}

function ArticlePreview({
  blog,
  language,
}: {
  blog: Blog
  language: "en" | "bn"
}) {
  const { title, excerpt, content } = blog[language]
  const blocks = content.filter(
    (block) =>
      block.kind !== "image" ||
      (block.src && block.width > 0 && block.height > 0)
  )
  return (
    <article
      className={`admin-article-preview ${blogBengali.variable}`}
      lang={language}
    >
      {(blog.cover || blog.coverSprite !== undefined) && (
        <BlogCover blog={blog} />
      )}
      <div>
        {statusBadge(blog.status)}{" "}
        {blog.category && <Badge>{blog.category}</Badge>}
      </div>
      <h2 className="admin-blog-preview-title">{title || "Untitled draft"}</h2>
      {excerpt && <p className="admin-excerpt">{excerpt}</p>}
      <div className="blog-prose" lang={language}>
        {blocks.length ? (
          <ArticleContent blocks={blocks} />
        ) : (
          <p>No article content in this language yet.</p>
        )}
      </div>
    </article>
  )
}
