import { categories, type ArticleBlock, type Category, type Localized } from "./schema"

type FeaturedImage =
  | { kind: "sprite"; tile: number }
  | { kind: "image"; src: string; width: number; height: number; alt: Localized<string> }

export type PublicPostCard = {
  slug: string
  author: Localized<string>
  title: Localized<string>
  excerpt: Localized<string>
  tags: Localized<string[]>
  minutes: Localized<number>
  categories: [Category, ...Category[]]
  publishedAt: string
  featuredImage: FeaturedImage | null
}

export type PublicPost = PublicPostCard & { content: Localized<ArticleBlock[]> }
export type BlogCategory = Category | "all"
export type BlogPage = {
  items: PublicPostCard[]
  total: number
  facets: Record<BlogCategory, number>
  nextCursor: string | null
}

export const blogPageSize = 6
export const isArticleSlug = (value: string) =>
  value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === "string"
const count = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
const localized = (value: unknown, check: (field: unknown) => boolean) =>
  record(value) && check(value.en) && check(value.bn)

function image(value: unknown): value is FeaturedImage | null {
  if (value === null) return true
  if (!record(value)) return false
  if (value.kind === "sprite") return count(value.tile) && value.tile <= 5
  return value.kind === "image" && text(value.src) &&
    !/[\s\\\u0000-\u001f\u007f]/u.test(value.src) && /^(https:\/\/[^/]|\/(?!\/))/i.test(value.src) &&
    count(value.width) && value.width > 0 && count(value.height) && value.height > 0 && localized(value.alt, text)
}

function readCard(value: unknown): PublicPostCard {
  if (
    !record(value) || !text(value.slug) || !isArticleSlug(value.slug) ||
    !localized(value.title, text) || !localized(value.excerpt, text) || !localized(value.author, text) ||
    !localized(value.tags, (tags) => Array.isArray(tags) && tags.every(text)) ||
    !localized(value.minutes, count) || !text(value.publishedAt) || !Number.isFinite(Date.parse(value.publishedAt)) ||
    !Array.isArray(value.categories) || !value.categories.length ||
    !value.categories.every((key) => text(key) && Object.hasOwn(categories, key)) ||
    !image(value.featuredImage)
  ) throw new Error("Invalid public article")
  // Pick only card fields, even if the endpoint sends additional metadata.
  const { slug, title, excerpt, author, tags, minutes, publishedAt, categories: keys, featuredImage } = value as PublicPostCard
  return { slug, title, excerpt, author, tags, minutes, publishedAt, categories: keys, featuredImage }
}

async function request(path: string, signal?: AbortSignal) {
  const deadline = AbortSignal.timeout(8_000)
  return fetch(path, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    signal: signal ? AbortSignal.any([signal, deadline]) : deadline,
  })
}

export async function fetchBlogPage(
  { query = "", category = "all", cursor }: { query?: string; category?: BlogCategory; cursor?: string } = {},
  signal?: AbortSignal,
  origin = ""
): Promise<BlogPage> {
  const params = new URLSearchParams({ limit: String(blogPageSize) })
  if (query.trim()) params.set("q", query.trim())
  if (category !== "all") params.set("category", category)
  if (cursor) params.set("cursor", cursor)
  const response = await request(`${origin}/api/posts?${params}`, signal)
  if (!response.ok) throw new Error("Public feed unavailable")
  const data: unknown = await response.json()
  if (!record(data) || !Array.isArray(data.items) || !count(data.total) || !record(data.facets) ||
    (data.nextCursor !== null && (!text(data.nextCursor) || !data.nextCursor))) {
    throw new Error("Invalid public feed")
  }
  const facets = data.facets
  if (!["all", ...Object.keys(categories)].every((key) => count(facets[key]))) {
    throw new Error("Invalid public facets")
  }
  return { items: data.items.map(readCard), total: data.total, facets: facets as BlogPage["facets"], nextCursor: data.nextCursor }
}

export async function fetchBlogArticle(slug: string, signal?: AbortSignal): Promise<PublicPost | null> {
  if (!isArticleSlug(slug)) return null
  const response = await request(`/api/posts/${encodeURIComponent(slug)}`, signal)
  if (response.status === 404) return null
  if (!response.ok) throw new Error("Public article unavailable")
  const data: unknown = await response.json()
  if (!record(data) || !record(data.item) || data.item.slug !== slug || !localized(data.item.content, Array.isArray)) {
    throw new Error("Invalid public article detail")
  }
  return { ...readCard(data.item), content: data.item.content as PublicPost["content"] }
}
