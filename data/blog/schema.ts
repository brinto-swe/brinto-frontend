export type Language = "en" | "bn"
export type Localized<T> = Record<Language, T>

export const categories = {
  ai: { en: "Artificial Intelligence", bn: "কৃত্রিম বুদ্ধিমত্তা" },
  ml: { en: "Machine Learning", bn: "মেশিন লার্নিং" },
  neuro: { en: "Neuro-Symbolic AI", bn: "নিউরো-সিম্বলিক এআই" },
  agriculture: {
    en: "Agricultural Computer Vision",
    bn: "কৃষিতে কম্পিউটার ভিশন",
  },
  web: { en: "Web Development", bn: "ওয়েব ডেভেলপমেন্ট" },
  engineering: { en: "Software Engineering", bn: "সফটওয়্যার প্রকৌশল" },
  research: { en: "Research", bn: "গবেষণা" },
  tutorial: { en: "Tutorials", bn: "টিউটোরিয়াল" },
} satisfies Record<string, Localized<string>>

export type Category = keyof typeof categories

export const inlineColors = {
  blue: "#174b92",
  teal: "#006358",
  purple: "#663399",
  red: "#a12638",
} as const

export type InlineMark = "bold" | "italic" | "underline" | "code"

export const maxArticleListDepth = 4

export function safeArticleHref(href: string) {
  if (
    typeof href !== "string" ||
    href.length > 2048 ||
    /[\s\\\u0000-\u001f\u007f]/u.test(href)
  )
    return undefined
  if (/^\/(?!\/)|^#[a-z\d-]+$/i.test(href)) return href
  if (!/^https:\/\/[^/]/i.test(href)) return undefined
  try {
    const url = new URL(href)
    if (url.hostname && !url.username && !url.password) return href
  } catch {
    return undefined
  }
}

export type InlineSpan = {
  kind: "span"
  text: string
  marks?: InlineMark[]
  color?: keyof typeof inlineColors
  href?: string
}

export type Inline =
  | string
  | { kind: "strong" | "emphasis" | "code"; text: string }
  | { kind: "link"; text: string; href: string }
  | InlineSpan

export type ArticleList = {
  kind: "list"
  ordered: boolean
  items: (Inline[] | { text: Inline[]; children: ArticleList[] })[]
}

export type ArticleBlock =
  | { kind: "heading"; level: 2 | 3; text: string | Inline[] }
  | { kind: "paragraph" | "quote"; text: Inline[] }
  | ArticleList
  | { kind: "code"; language: string; code: string; caption: string }
  | {
      kind: "image"
      src: string
      width: number
      height: number
      alt: string
      caption: string
    }

export type BlogPost = {
  id: string
  categories: [Category, ...Category[]]
  date: string
  cover?: 0 | 1 | 2 | 3 | 4 | 5
  title: Localized<string>
  excerpt: Localized<string>
  tags: Localized<string[]>
  minutes: Localized<number>
  content: Localized<ArticleBlock[]>
}

export const paragraph = (...text: Inline[]): ArticleBlock => ({
  kind: "paragraph",
  text,
})
export const heading = (text: string, level: 2 | 3 = 2): ArticleBlock => ({
  kind: "heading",
  text,
  level,
})
export const quote = (...text: Inline[]): ArticleBlock => ({
  kind: "quote",
  text,
})
export const list = (items: string[], ordered = false): ArticleBlock => ({
  kind: "list",
  ordered,
  items: items.map((item) => [item]),
})

export function searchableBlock(block: ArticleBlock): string {
  switch (block.kind) {
    case "heading":
      return typeof block.text === "string"
        ? block.text
        : inlineText(block.text)
    case "paragraph":
    case "quote":
      return inlineText(block.text)
    case "list":
      return block.items
        .map((item) =>
          Array.isArray(item)
            ? inlineText(item)
            : [
                inlineText(item.text),
                ...item.children.map(searchableBlock),
              ].join(" ")
        )
        .join(" ")
    case "code":
      return `${block.language} ${block.caption} ${block.code}`
    case "image":
      return `${block.caption} ${block.alt}`
  }
}

export function inlineText(parts: Inline[]) {
  return parts
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("")
}
