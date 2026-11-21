import { Fragment, type ReactNode } from "react"
import Image from "next/image"
import {
  inlineColors,
  safeArticleHref,
  type ArticleBlock,
  type ArticleList,
  type Inline,
  type InlineSpan,
} from "@/data/blog/schema"

function MarkedSpan({ part }: { part: InlineSpan }) {
  let content: ReactNode = part.text
  if (part.color && Object.hasOwn(inlineColors, part.color)) {
    content = <span style={{ color: inlineColors[part.color] }}>{content}</span>
  }
  if (part.marks?.includes("code")) content = <code>{content}</code>
  if (part.marks?.includes("underline")) content = <u>{content}</u>
  if (part.marks?.includes("italic")) content = <em>{content}</em>
  if (part.marks?.includes("bold")) content = <strong>{content}</strong>
  const href = part.href && safeArticleHref(part.href)
  return href ? <a href={href}>{content}</a> : content
}

function RichText({ parts }: { parts: Inline[] }) {
  return parts.map((part, index) => {
    if (typeof part === "string") return <Fragment key={index}>{part}</Fragment>
    switch (part.kind) {
      case "strong":
        return <strong key={index}>{part.text}</strong>
      case "emphasis":
        return <em key={index}>{part.text}</em>
      case "code":
        return <code key={index}>{part.text}</code>
      case "span":
        return <MarkedSpan key={index} part={part} />
      case "link": {
        const href = safeArticleHref(part.href)
        return href ? (
          <a key={index} href={href}>
            {part.text}
          </a>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        )
      }
    }
  })
}

function RichList({ block }: { block: ArticleList }) {
  const List = block.ordered ? "ol" : "ul"
  return (
    <List>
      {block.items.map((item, index) => (
        <li key={index}>
          <RichText parts={Array.isArray(item) ? item : item.text} />
          {!Array.isArray(item) &&
            item.children.map((child, childIndex) => (
              <RichList key={childIndex} block={child} />
            ))}
        </li>
      ))}
    </List>
  )
}

export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "heading": {
        const Heading = block.level === 2 ? "h2" : "h3"
        return (
          <Heading key={index}>
            {typeof block.text === "string" ? (
              block.text
            ) : (
              <RichText parts={block.text} />
            )}
          </Heading>
        )
      }
      case "paragraph":
        return (
          <p key={index}>
            <RichText parts={block.text} />
          </p>
        )
      case "quote":
        return (
          <blockquote key={index}>
            <RichText parts={block.text} />
          </blockquote>
        )
      case "list":
        return <RichList key={index} block={block} />
      case "image":
        return (
          <figure key={index}>
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              unoptimized={block.src.startsWith("https://")}
              sizes="(max-width: 670px) 90vw, 740px"
            />
            <figcaption>{block.caption}</figcaption>
          </figure>
        )
      case "code":
        return (
          <figure className="blog-code" key={index}>
            <pre tabIndex={0} aria-label={block.language}>
              <code translate="no">{block.code}</code>
            </pre>
            <figcaption>{block.caption}</figcaption>
          </figure>
        )
    }
  })
}
