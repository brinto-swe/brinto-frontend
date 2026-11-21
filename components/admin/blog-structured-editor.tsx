"use client"

import { useId, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Bold,
  CodeXml,
  Italic,
  Trash2,
  Underline,
} from "lucide-react"
import { ArticleContent } from "@/components/blog/article-content"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  inlineColors,
  inlineText,
  maxArticleListDepth,
  safeArticleHref,
  type ArticleBlock,
  type ArticleList,
  type Inline,
  type InlineMark,
  type InlineSpan,
} from "@/data/blog/schema"
import { AdminImageUploader, type UploadedImage } from "./image-uploader"
import { editInline, replaceInline } from "./blog-editor-model"
import { Button } from "./ui"
import type { BlogTranslation } from "./data"

const marks = [
  ["bold", "Bold", Bold],
  ["italic", "Italic", Italic],
  ["underline", "Underline", Underline],
  ["code", "Inline code", CodeXml],
] as const satisfies readonly (readonly [InlineMark, string, typeof Bold])[]

function InlineField({
  label,
  parts,
  onChange,
  compact = false,
  maxLength,
}: {
  label: string
  parts: Inline[]
  onChange: (parts: Inline[]) => void
  compact?: boolean
  maxLength?: number
}) {
  const id = useId()
  const editor = useRef<HTMLTextAreaElement>(null)
  const [href, setHref] = useState("")
  const [message, setMessage] = useState("")
  function apply(edit: Parameters<typeof editInline>[3]) {
    const input = editor.current
    if (!input) return
    const { selectionStart, selectionEnd } = input
    if (selectionStart === selectionEnd) {
      setMessage("Select text in this field first.")
      input.focus()
      return
    }
    if (
      "href" in edit &&
      edit.href &&
      !input.value.slice(selectionStart, selectionEnd).trim()
    ) {
      setMessage("Select visible text for the link.")
      input.focus()
      return
    }
    setMessage("")
    onChange(editInline(parts, selectionStart, selectionEnd, edit))
    input.focus()
    input.setSelectionRange(selectionStart, selectionEnd)
  }
  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <Textarea
        id={id}
        ref={editor}
        value={inlineText(parts)}
        rows={compact ? 2 : 3}
        maxLength={maxLength}
        onChange={(event) =>
          onChange(
            replaceInline(
              parts,
              event.target.value,
              event.target.selectionStart
            )
          )
        }
      />
      <div
        role="group"
        aria-label={`${label} formatting`}
        className="admin-formatting"
      >
        {marks.map(([mark, name, Icon]) => (
          <Button
            key={mark}
            type="button"
            variant="ghost"
            size="icon-sm"
            title={name}
            aria-label={name}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => apply({ mark })}
          >
            <Icon size={16} />
          </Button>
        ))}
        <select
          aria-label="Text color"
          value=""
          onChange={(event) =>
            apply({
              color: (event.target.value === "clear"
                ? undefined
                : event.target.value) as InlineSpan["color"],
            })
          }
        >
          <option value="" disabled>
            Text color
          </option>
          {Object.keys(inlineColors).map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
          <option value="clear">Default color</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label={`${label} link address`}
          className="min-w-36 flex-1"
          value={href}
          placeholder="HTTPS, /path, or #anchor"
          onChange={(event) => setHref(event.target.value)}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const url = safeArticleHref(href.trim())
            if (!url)
              setMessage(
                "Enter an HTTPS URL, site-relative path, or simple anchor."
              )
            else apply({ href: url })
          }}
        >
          Apply link
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => apply({ href: undefined })}
        >
          Remove link
        </Button>
      </div>
      {message && (
        <p role="status" className="text-sm text-destructive">
          {message}
        </p>
      )}
      {parts.some((part) => typeof part !== "string") && (
        <div className="blog-prose !m-0">
          <ArticleContent blocks={[{ kind: "paragraph", text: parts }]} />
        </div>
      )}
    </div>
  )
}

const newList = (ordered: boolean): ArticleList => ({
  kind: "list",
  ordered,
  items: [[""]],
})

function ListFields({
  block,
  depth,
  onChange,
}: {
  block: ArticleList
  depth: number
  onChange: (block: ArticleList) => void
}) {
  function updateItem(index: number, item: ArticleList["items"][number]) {
    onChange({
      ...block,
      items: block.items.map((old, position) =>
        position === index ? item : old
      ),
    })
  }
  return (
    <div className="space-y-3">
      <label className="flex flex-wrap items-center gap-2">
        List type
        <select
          value={String(block.ordered)}
          onChange={(event) =>
            onChange({ ...block, ordered: event.target.value === "true" })
          }
        >
          <option value="false">Bulleted</option>
          <option value="true">Numbered</option>
        </select>
      </label>
      {block.items.map((item, index) => {
        const text = Array.isArray(item) ? item : item.text
        const children = Array.isArray(item) ? [] : item.children
        const updateChildren = (next: ArticleList[]) =>
          updateItem(index, next.length ? { text, children: next } : text)
        return (
          <div key={index} className="space-y-2 border-s-2 ps-2 sm:ps-3">
            <InlineField
              key={index}
              label={`List item ${index + 1}`}
              parts={text}
              compact
              onChange={(parts) =>
                updateItem(
                  index,
                  children.length ? { text: parts, children } : parts
                )
              }
            />
            <div className="flex flex-wrap gap-2">
              {depth < maxArticleListDepth && children.length < 100 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => updateChildren([...children, newList(false)])}
                >
                  Add nested list
                </Button>
              )}
              {block.items.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onChange({
                      ...block,
                      items: block.items.filter(
                        (_, position) => position !== index
                      ),
                    })
                  }
                >
                  Remove item
                </Button>
              )}
            </div>
            {children.map((child, position) => (
              <div key={position} className="space-y-2 border-s-2 ps-2 sm:ps-3">
                <ListFields
                  block={child}
                  depth={depth + 1}
                  onChange={(updated) =>
                    updateChildren(
                      children.map((entry, i) =>
                        i === position ? updated : entry
                      )
                    )
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    updateChildren(children.filter((_, i) => i !== position))
                  }
                >
                  Remove nested list
                </Button>
              </div>
            ))}
          </div>
        )
      })}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={block.items.length >= 100}
        onClick={() => onChange({ ...block, items: [...block.items, [""]] })}
      >
        Add list item
      </Button>
    </div>
  )
}

const blockTypes = {
  paragraph: "Paragraph",
  h2: "Heading 2",
  h3: "Heading 3",
  quote: "Blockquote",
  bullets: "Bulleted list",
  numbers: "Numbered list",
  code: "Code block",
  image: "Image",
} as const
type BlockType = keyof typeof blockTypes

function makeBlock(type: BlockType): ArticleBlock {
  switch (type) {
    case "paragraph":
    case "quote":
      return { kind: type, text: [""] }
    case "h2":
    case "h3":
      return { kind: "heading", level: type === "h2" ? 2 : 3, text: "" }
    case "bullets":
    case "numbers":
      return newList(type === "numbers")
    case "code":
      return { kind: "code", language: "", code: "", caption: "" }
    case "image":
      return {
        kind: "image",
        src: "",
        width: 0,
        height: 0,
        alt: "",
        caption: "",
      }
  }
}

function typeOf(block: ArticleBlock): BlockType {
  if (block.kind === "heading") return block.level === 2 ? "h2" : "h3"
  if (block.kind === "list") return block.ordered ? "numbers" : "bullets"
  return block.kind
}

function BlockFields({
  block,
  asset,
  onChange,
  onImage,
}: {
  block: ArticleBlock
  asset?: UploadedImage
  onChange: (block: ArticleBlock) => void
  onImage: (asset: UploadedImage | null) => void
}) {
  switch (block.kind) {
    case "paragraph":
    case "quote":
    case "heading":
      return (
        <InlineField
          label="Text"
          parts={typeof block.text === "string" ? [block.text] : block.text}
          maxLength={block.kind === "heading" ? 300 : undefined}
          onChange={(text) => onChange({ ...block, text })}
        />
      )
    case "list":
      return <ListFields block={block} depth={1} onChange={onChange} />
    case "code":
      return (
        <div className="space-y-2">
          <label className="block">
            Language
            <Input
              value={block.language}
              maxLength={50}
              onChange={(event) =>
                onChange({ ...block, language: event.target.value })
              }
            />
          </label>
          <label className="block">
            Code
            <Textarea
              value={block.code}
              maxLength={16000}
              rows={5}
              className="font-mono"
              onChange={(event) =>
                onChange({ ...block, code: event.target.value })
              }
            />
          </label>
          <label className="block">
            Caption
            <Input
              value={block.caption}
              maxLength={1000}
              onChange={(event) =>
                onChange({ ...block, caption: event.target.value })
              }
            />
          </label>
        </div>
      )
    case "image":
      return (
        <div className="space-y-2">
          {block.src && block.width > 0 && block.height > 0 && !asset && (
            <div className="blog-prose !m-0">
              <ArticleContent blocks={[block]} />
            </div>
          )}
          <AdminImageUploader
            purpose="blog-content"
            value={asset ?? null}
            onChange={onImage}
            label="Article image"
          />
          <div className="flex flex-wrap gap-2">
            {(["width", "height"] as const).map((dimension) => (
              <label key={dimension} className="block w-28 capitalize">
                {dimension}
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={block[dimension] || ""}
                  readOnly={!!asset || !block.src}
                  onChange={(event) =>
                    onChange({
                      ...block,
                      [dimension]: event.target.valueAsNumber || 0,
                    })
                  }
                />
              </label>
            ))}
          </div>
          <label className="block">
            Alt text
            <Input
              value={block.alt}
              maxLength={500}
              onChange={(event) =>
                onChange({ ...block, alt: event.target.value })
              }
            />
          </label>
          <label className="block">
            Caption
            <Input
              value={block.caption}
              maxLength={1000}
              onChange={(event) =>
                onChange({ ...block, caption: event.target.value })
              }
            />
          </label>
        </div>
      )
  }
}

export function StructuredEditor({
  translation,
  onChange,
}: {
  translation: BlogTranslation
  onChange: (update: (translation: BlogTranslation) => BlogTranslation) => void
}) {
  const { content, imageAssets } = translation
  const [keys, setKeys] = useState(() => content.map((_, index) => index))
  const positions = useRef(keys)
  const nextKey = useRef(keys.length)
  const [type, setType] = useState<BlockType>("paragraph")

  function setPositions(values: number[]) {
    positions.current = values
    setKeys(values)
  }

  function updateBlock(
    key: number,
    update: (block: ArticleBlock) => ArticleBlock,
    asset?: UploadedImage
  ) {
    const position = positions.current.indexOf(key)
    if (position < 0) return
    onChange((current) => ({
      ...current,
      content: current.content.map((block, index) =>
        index === position ? update(block) : block
      ),
      ...(asset && {
        imageAssets: [
          ...(current.imageAssets ?? []).filter(
            (item) => item.imageUrl !== asset.imageUrl
          ),
          asset,
        ],
      }),
    }))
  }

  function move(index: number, delta: number) {
    const other = index + delta
    const reorder = <T,>(array: T[]) => {
      const copy = [...array]
      ;[copy[index], copy[other]] = [copy[other], copy[index]]
      return copy
    }
    setPositions(reorder(keys))
    onChange((current) => ({ ...current, content: reorder(current.content) }))
  }

  return (
    <div className="space-y-3">
      {content.map((block, index) => {
        const key = keys[index]
        return (
          <section
            key={key}
            aria-label={`Block ${index + 1}`}
            className="min-w-0 space-y-3 rounded-lg border p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">{blockTypes[typeOf(block)]}</h3>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="Move up"
                  aria-label={`Move block ${index + 1} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={15} />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="Move down"
                  aria-label={`Move block ${index + 1} down`}
                  disabled={index === content.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={15} />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="Remove block"
                  aria-label={`Remove block ${index + 1}`}
                  onClick={() => {
                    setPositions(
                      keys.filter((_, position) => position !== index)
                    )
                    onChange((current) => ({
                      ...current,
                      content: current.content.filter(
                        (_, position) => position !== index
                      ),
                    }))
                  }}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
            <BlockFields
              block={block}
              asset={
                block.kind === "image"
                  ? imageAssets?.find((item) => item.imageUrl === block.src)
                  : undefined
              }
              onChange={(updated) => updateBlock(key, () => updated)}
              onImage={(asset) =>
                updateBlock(
                  key,
                  (current) =>
                    current.kind === "image"
                      ? {
                          ...current,
                          src: asset?.imageUrl ?? "",
                          width: asset?.width ?? 0,
                          height: asset?.height ?? 0,
                        }
                      : current,
                  asset ?? undefined
                )
              }
            />
          </section>
        )
      })}
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Block type"
          value={type}
          onChange={(event) => setType(event.target.value as BlockType)}
        >
          {Object.entries(blockTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          disabled={content.length >= 120}
          onClick={() => {
            setPositions([...keys, nextKey.current++])
            onChange((current) => ({
              ...current,
              content: [...current.content, makeBlock(type)],
            }))
          }}
        >
          Add block
        </Button>
      </div>
    </div>
  )
}
