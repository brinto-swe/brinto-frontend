import assert from "node:assert/strict"
import { registerHooks } from "node:module"
import { test } from "node:test"

const root = new URL("../", import.meta.url)
const loader = registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.startsWith(root.href)) {
      if (specifier.startsWith("@/")) {
        return next(new URL(`${specifier.slice(2)}.ts`, root).href, context)
      }
      if (context.parentURL.endsWith(".ts") && /^\.\/[-\w]+$/.test(specifier)) {
        return next(`${specifier}.ts`, context)
      }
    }
    return next(specifier, context)
  },
})

const model = await import("../components/admin/blog-editor-model.ts")
const { blogPosts } = await import("../data/blog/posts.ts")
const { seed, publicBlogDemos } = await import("../components/admin/data.ts")
const { readSnapshot, saveDemo } = await import("../components/admin/store.ts")
loader.deregister()

test("formats selected text without stripping surrounding or combined marks", () => {
  const parts = ["plain ", { kind: "strong", text: "sample" }, " tail"]
  let result = model.editInline(parts, 7, 11, { mark: "italic" })
  result = model.editInline(result, 7, 11, { mark: "underline" })
  result = model.editInline(result, 7, 11, { mark: "code" })
  for (const color of ["blue", "teal", "purple", "red"]) {
    result = model.editInline(result, 7, 11, { color })
    assert.equal(result[2].color, color)
  }
  result = model.editInline(result, 7, 11, { href: "/blogs#example" })
  assert.deepEqual(result, [
    "plain ",
    { kind: "strong", text: "s" },
    {
      kind: "span",
      text: "ampl",
      marks: ["bold", "italic", "underline", "code"],
      color: "red",
      href: "/blogs#example",
    },
    { kind: "strong", text: "e" },
    " tail",
  ])
  assert.deepEqual(
    model.editInline(result, 7, 11, { href: "javascript:alert(1)" }),
    result
  )
  const typed = model.replaceInline(result, "plain samXple tail", 11)
  assert.equal(typed[2].text, "amXpl")
  assert.deepEqual(typed[2].marks, result[2].marks)
  const restored = model.editInline(typed, 7, 12, { mark: "bold" })
  assert.deepEqual(restored[2].marks, ["italic", "underline", "code"])
})

test("loads all ten source articles verbatim and upgrades former Markdown without replacing saved records", () => {
  const legacy = {
    id: "old",
    cover: "/blog/desk.webp",
    category: "AI",
    author: "Owner",
    date: "",
    status: "Draft",
    tags: "AI, Research",
    en: {
      title: "Old",
      excerpt: "Excerpt",
      article:
        "## **Heading**\n\n- One\n- Two\n\n```js\nx()\n```\nCaption: Code",
    },
    bn: { title: "পুরোনো", excerpt: "সারাংশ", article: "> বাংলা লেখা" },
  }
  const unrelated = { ...seed.profile, nickname: "Custom" }
  const migrated = readSnapshot(
    JSON.stringify({ blogs: [legacy], profile: unrelated })
  )
  assert.deepEqual(migrated.profile, unrelated)
  assert.equal(migrated.blogs.length, 11)
  const [upgraded] = migrated.blogs
  assert.ok(!("article" in upgraded.en))
  assert.deepEqual(upgraded.en.tags, ["AI", "Research"])
  assert.deepEqual(upgraded.bn.tags, ["AI", "Research"])
  assert.deepEqual(upgraded.en.content, [
    { kind: "heading", level: 2, text: [{ kind: "strong", text: "Heading" }] },
    { kind: "list", ordered: false, items: [["One"], ["Two"]] },
    { kind: "code", language: "js", code: "x()", caption: "Code" },
  ])
  for (const source of blogPosts) {
    const copy = migrated.blogs.find((blog) => blog.id === source.id)
    assert.deepEqual(copy.en.content, source.content.en)
    assert.deepEqual(copy.bn.content, source.content.bn)
    assert.deepEqual(copy.en.tags, source.tags.en)
    assert.deepEqual(copy.bn.tags, source.tags.bn)
    assert.equal(copy.coverSprite, source.cover)
  }
  assert.deepEqual(
    readSnapshot(JSON.stringify({ ...migrated, blogs: [] })).blogs,
    []
  )
})

test("localStorage save and reload retain both translations, media metadata, and draft validation", (t) => {
  const items = new Map()
  globalThis.window = {
    localStorage: {
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => items.set(key, value),
    },
  }
  t.after(() => {
    delete globalThis.window
  })
  const asset = {
    assetId: "222222222222222222222222",
    imageUrl: "https://i.ibb.co/example/file.png",
    width: 137,
    height: 91,
    mimeType: "image/png",
    fileSize: 456,
  }
  const en = {
    title: "English",
    excerpt: "Summary",
    tags: ["English tag"],
    imageAssets: [asset],
    content: [
      {
        kind: "paragraph",
        text: [
          {
            kind: "span",
            text: "Formatted",
            marks: ["bold", "italic", "underline"],
            color: "purple",
          },
        ],
      },
      {
        kind: "list",
        ordered: true,
        items: [
          {
            text: ["Parent"],
            children: [{ kind: "list", ordered: false, items: [["Child"]] }],
          },
        ],
      },
      {
        kind: "image",
        src: asset.imageUrl,
        width: asset.width,
        height: asset.height,
        alt: "Alt",
        caption: "Caption",
      },
      { kind: "code", language: "js", code: "const x = 1", caption: "Code" },
    ],
  }
  const bn = {
    title: "",
    excerpt: "বাংলা সারাংশ",
    tags: ["বাংলা"],
    content: [{ kind: "quote", text: ["বাংলা লেখা"] }],
  }
  assert.equal(model.publishableTranslation(en), true)
  assert.equal(model.publishableTranslation(bn), false)
  const blog = {
    ...publicBlogDemos[0],
    id: "test",
    en,
    bn,
    coverAsset: asset,
    cover: asset.imageUrl,
    status: "Draft",
  }
  assert.equal(
    saveDemo((state) => ({ ...state, blogs: [blog, ...state.blogs] })),
    true
  )
  const reloaded = readSnapshot(items.get("brinto-admin-demo-v1")).blogs[0]
  assert.deepEqual(reloaded, blog)
  assert.equal(
    model.publishableTranslation({ ...reloaded.bn, title: "বাংলা" }),
    true
  )
})
