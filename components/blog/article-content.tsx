import { Fragment } from "react"
import Image from "next/image"
import type { ArticleBlock, Inline } from "@/data/blog/schema"

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
      case "link":
        return /^https:\/\/|^\/(?![\\/])|^#[a-z\d-]+$/i.test(part.href) ? (
          <a key={index} href={part.href}>
            {part.text}
          </a>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        )
    }
  })
}

export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "heading": {
        const Heading = block.level === 2 ? "h2" : "h3"
        return <Heading key={index}>{block.text}</Heading>
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
      case "list": {
        const List = block.ordered ? "ol" : "ul"
        return (
          <List key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <RichText parts={item} />
              </li>
            ))}
          </List>
        )
      }
      case "image":
        return (
          <figure key={index}>
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
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
