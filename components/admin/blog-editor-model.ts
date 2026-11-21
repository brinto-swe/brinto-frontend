import {
  inlineText,
  safeArticleHref,
  type ArticleBlock,
  type Inline,
  type InlineMark,
  type InlineSpan,
} from "@/data/blog/schema"
import type { BlogTranslation } from "./data"

type Style = Pick<InlineSpan, "color" | "href" | "marks">
type Edit =
  | { mark: InlineMark }
  | { color: Style["color"] }
  | { href: string | undefined }
const markOrder: InlineMark[] = ["bold", "italic", "underline", "code"]

function inlineStyle(part: Inline): Style {
  if (typeof part === "string") return {}
  switch (part.kind) {
    case "strong":
      return { marks: ["bold"] }
    case "emphasis":
      return { marks: ["italic"] }
    case "code":
      return { marks: ["code"] }
    case "link":
      return { href: part.href }
    case "span":
      return { marks: part.marks, color: part.color, href: part.href }
  }
}

function span(text: string, { marks, color, href }: Style): Inline {
  if (!text.trim()) href = undefined
  return marks?.length || color || href
    ? {
        kind: "span",
        text,
        ...(marks?.length && { marks }),
        ...(color && { color }),
        ...(href && { href }),
      }
    : text
}

function split(parts: Inline[], offset: number): [Inline[], Inline[]] {
  const before: Inline[] = []
  const after: Inline[] = []
  for (const part of parts) {
    const text = typeof part === "string" ? part : part.text
    if (offset <= 0) after.push(part)
    else if (offset >= text.length) before.push(part)
    else if (typeof part === "string") {
      before.push(text.slice(0, offset))
      after.push(text.slice(offset))
    } else {
      const slice = (text: string) =>
        text.trim() ? { ...part, text } : span(text, inlineStyle(part))
      before.push(slice(text.slice(0, offset)))
      after.push(slice(text.slice(offset)))
    }
    offset -= text.length
  }
  return [before, after]
}

function compact(parts: Inline[]) {
  const output: Inline[] = []
  for (const part of parts) {
    const text = typeof part === "string" ? part : part.text
    if (!text) continue
    const previous = output.at(-1)
    if (typeof previous === "string" && typeof part === "string") {
      output[output.length - 1] = previous + part
    } else if (
      typeof previous === "object" &&
      previous.kind === "span" &&
      typeof part === "object" &&
      part.kind === "span" &&
      previous.color === part.color &&
      previous.href === part.href &&
      previous.marks?.join(",") === part.marks?.join(",")
    ) {
      output[output.length - 1] = {
        ...previous,
        text: previous.text + part.text,
      }
    } else output.push(part)
  }
  return output.length ? output : [""]
}

export function editInline(
  parts: Inline[],
  start: number,
  end: number,
  edit: Edit
): Inline[] {
  if (
    start >= end ||
    ("href" in edit && edit.href && !safeArticleHref(edit.href))
  )
    return parts
  const [before, rest] = split(parts, start)
  const [selection, after] = split(rest, end - start)
  const remove =
    "mark" in edit &&
    selection.every((part) => inlineStyle(part).marks?.includes(edit.mark))
  const changed = selection.map((part) => {
    const style = inlineStyle(part)
    const text = typeof part === "string" ? part : part.text
    if ("mark" in edit) {
      const active = new Set(style.marks)
      if (remove) active.delete(edit.mark)
      else active.add(edit.mark)
      style.marks = markOrder.filter((mark) => active.has(mark))
    } else if ("color" in edit) style.color = edit.color
    else style.href = edit.href
    return span(text, style)
  })
  return compact([...before, ...changed, ...after])
}

export function replaceInline(
  parts: Inline[],
  value: string,
  caret: number
): Inline[] {
  const previous = inlineText(parts)
  if (previous === value) return parts
  let start = 0
  while (
    start < Math.min(caret, previous.length, value.length) &&
    previous[start] === value[start]
  )
    start++
  let oldEnd = previous.length
  let newEnd = value.length
  while (
    oldEnd > start &&
    newEnd > Math.max(start, caret) &&
    previous[oldEnd - 1] === value[newEnd - 1]
  ) {
    oldEnd--
    newEnd--
  }
  const [before, rest] = split(parts, start)
  const [replaced, after] = split(rest, oldEnd - start)
  const style = inlineStyle(replaced[0] ?? before.at(-1) ?? after[0] ?? "")
  return compact([...before, span(value.slice(start, newEnd), style), ...after])
}

function legacyInline(text: string): Inline[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\x60[^\x60]+\x60|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return { kind: "strong", text: part.slice(2, -2) }
      if (part.startsWith("*") && part.endsWith("*"))
        return { kind: "emphasis", text: part.slice(1, -1) }
      if (part.startsWith("\x60") && part.endsWith("\x60"))
        return { kind: "code", text: part.slice(1, -1) }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      return link && safeArticleHref(link[2])
        ? { kind: "link", text: link[1], href: link[2] }
        : part
    })
}

// Only used to read snapshots saved by the former Admin Markdown textarea.
export function legacyArticle(article: string): ArticleBlock[] {
  const result: ArticleBlock[] = []
  const lines = article.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const fence = line.match(/^\x60{3}(.*)$/)
    const heading = line.match(/^(#{1,3}) (.*)$/)
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    const marker = line.match(/^(- |\d+\. )/)
    if (fence) {
      const code: string[] = []
      while (i + 1 < lines.length && !lines[i + 1].startsWith("\x60\x60\x60"))
        code.push(lines[++i])
      if (i + 1 < lines.length) i++
      const caption = lines[i + 1]?.startsWith("Caption: ")
        ? lines[++i].slice(9)
        : ""
      result.push({
        kind: "code",
        language: fence[1].trim() || "text",
        code: code.join("\n"),
        caption,
      })
    } else if (heading) {
      result.push({
        kind: "heading",
        level: heading[1].length === 3 ? 3 : 2,
        text: legacyInline(heading[2]),
      })
    } else if (
      image &&
      safeArticleHref(image[2]) &&
      !image[2].startsWith("#")
    ) {
      const caption = lines[i + 1]?.startsWith("Caption: ")
        ? lines[++i].slice(9)
        : ""
      // The previous format stored no dimensions.
      result.push({
        kind: "image",
        src: image[2],
        width: 960,
        height: image[2] === "/blog/desk.webp" ? 492 : 540,
        alt: image[1],
        caption,
      })
    } else if (line.startsWith("> ")) {
      result.push({ kind: "quote", text: legacyInline(line.slice(2)) })
    } else if (marker) {
      const ordered = marker[1] !== "- "
      const prefix = ordered ? /^\d+\. / : /^- /
      const items = [legacyInline(line.replace(prefix, ""))]
      while (i + 1 < lines.length && prefix.test(lines[i + 1]))
        items.push(legacyInline(lines[++i].replace(prefix, "")))
      result.push({ kind: "list", ordered, items })
    } else result.push({ kind: "paragraph", text: legacyInline(line) })
  }
  return result
}

export type LegacyTranslation = Omit<BlogTranslation, "tags" | "content"> & {
  article?: string
  tags?: string[] | string
  content?: ArticleBlock[]
}

export function restoreTranslation(
  old: LegacyTranslation | undefined,
  sharedTags = ""
): BlogTranslation {
  const { article, ...translation } = old ?? { title: "", excerpt: "" }
  return {
    ...translation,
    tags: Array.isArray(old?.tags)
      ? old.tags
      : (old?.tags ?? sharedTags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    content: Array.isArray(old?.content)
      ? old.content
      : legacyArticle(typeof article === "string" ? article : ""),
  }
}

function publishableBlock(block: ArticleBlock): boolean {
  switch (block.kind) {
    case "image":
      return (
        !!block.src &&
        !!safeArticleHref(block.src) &&
        !block.src.startsWith("#") &&
        block.width > 0 &&
        block.height > 0
      )
    case "code":
      return !!block.language.trim() && !!block.code.trim()
    case "list":
      return (
        block.items.length > 0 &&
        block.items.every((item) =>
          Array.isArray(item)
            ? !!inlineText(item).trim()
            : !!inlineText(item.text).trim() &&
              item.children.every(publishableBlock)
        )
      )
    default:
      return !!(
        typeof block.text === "string" ? block.text : inlineText(block.text)
      ).trim()
  }
}

export function publishableTranslation(translation: BlogTranslation) {
  return (
    !!translation.title.trim() &&
    !!translation.excerpt.trim() &&
    translation.content.length > 0 &&
    translation.content.every(publishableBlock)
  )
}
