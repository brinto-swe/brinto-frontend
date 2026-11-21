import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { test } from "node:test"
import { runInThisContext } from "node:vm"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"

const require = createRequire(import.meta.url)

// Node cannot load TSX directly. Compile just the reader and its local data in memory.
function loadModule(path, imports = {}) {
  const filename = new URL(path, import.meta.url)
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  const runModule = runInThisContext(
    `(function(require, exports) { ${source}\n})`,
    {
      filename: filename.pathname,
    }
  )
  runModule(
    (specifier) =>
      Object.hasOwn(imports, specifier)
        ? imports[specifier]
        : require(specifier),
    exports
  )
  return exports
}

const schema = loadModule("../data/blog/schema.ts")
const { blogPosts } = loadModule("../data/blog/posts.ts", {
  "./schema": schema,
})
const { ArticleContent } = loadModule(
  "../components/blog/article-content.tsx",
  {
    "@/data/blog/schema": schema,
  }
)
const render = (blocks) =>
  renderToStaticMarkup(createElement(ArticleContent, { blocks }))

test("all ten legacy articles render in both languages", () => {
  assert.equal(blogPosts.length, 10)
  for (const post of blogPosts) {
    for (const language of ["en", "bn"]) {
      const blocks = post.content[language]
      const markup = render(blocks)
      const heading = blocks.find((block) => block.kind === "heading")
      assert.ok(heading && typeof heading.text === "string", post.id)
      assert.ok(
        markup.includes(
          renderToStaticMarkup(
            createElement(`h${heading.level}`, null, heading.text)
          )
        ),
        post.id
      )
      assert.ok(markup.includes("<p>"), post.id)
      assert.ok(
        blocks.every(
          (block) => typeof schema.searchableBlock(block) === "string"
        ),
        post.id
      )
    }
  }
})

test("composes every subset of marks with the approved colors and a link", () => {
  const marks = [
    ["bold", "strong"],
    ["italic", "em"],
    ["underline", "u"],
    ["code", "code"],
  ]
  const colors = {
    blue: "#174b92",
    teal: "#006358",
    purple: "#663399",
    red: "#a12638",
  }
  for (const [color, hex] of Object.entries(colors)) {
    for (let index = 0; index < 16; index++) {
      const active = marks.filter((_, bit) => index & (1 << bit))
      const text = `<span style="color:${hex}">Test &amp; &lt;markup&gt;</span>`
      const expected = active.reduceRight(
        (inner, [, tag]) => `<${tag}>${inner}</${tag}>`,
        text
      )
      const inline = {
        kind: "span",
        text: "Test & <markup>",
        marks: active.map(([mark]) => mark),
        color,
        href: "/blogs",
      }
      assert.equal(
        render([{ kind: "paragraph", text: [inline] }]),
        `<p><a href="/blogs">${expected}</a></p>`
      )
    }
  }
})

test("unsafe hrefs stay unlinked and unknown palette keys receive no style", () => {
  for (const href of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.test",
    "//example.test",
    "/\\example.test",
    "https:///example.test",
    "https://user@example.test",
    "/line\nbreak",
    "#bad anchor",
  ]) {
    assert.equal(
      render([
        {
          kind: "quote",
          text: [
            {
              kind: "span",
              text: "Text",
              marks: ["italic"],
              href,
              color: "constructor",
            },
            { kind: "link", text: "Legacy", href },
          ],
        },
      ]),
      "<blockquote><em>Text</em>Legacy</blockquote>"
    )
  }
  for (const href of [
    "https://example.test/path",
    "/blogs?view=compact",
    "#example",
  ]) {
    assert.equal(
      render([
        { kind: "paragraph", text: [{ kind: "span", text: "Text", href }] },
      ]),
      `<p><a href="${href}">Text</a></p>`
    )
  }
})

test("renders nested lists, styled headings, code blocks and image captions with their metadata", () => {
  const blocks = [
    {
      kind: "heading",
      level: 3,
      text: [{ kind: "span", text: "শিরোনাম", marks: ["underline"] }],
    },
    {
      kind: "list",
      ordered: true,
      items: [
        ["Flat item"],
        {
          text: [{ kind: "span", text: "Parent", marks: ["bold"] }],
          children: [
            {
              kind: "list",
              ordered: false,
              items: [[{ kind: "code", text: "Child" }]],
            },
          ],
        },
      ],
    },
    {
      kind: "code",
      language: "js",
      code: "const x = 1;\n<test>",
      caption: "Example",
    },
    {
      kind: "image",
      src: "https://i.ibb.co/example/desk.png",
      width: 960,
      height: 500,
      alt: "Desk",
      caption: "Working area",
    },
  ]
  const markup = render(blocks)
  assert.ok(markup.includes("<h3><u>শিরোনাম</u></h3>"))
  assert.ok(
    markup.includes(
      "<ol><li>Flat item</li><li><strong>Parent</strong><ul><li><code>Child</code></li></ul></li></ol>"
    )
  )
  assert.ok(
    markup.includes(
      '<pre tabindex="0" aria-label="js"><code translate="no">const x = 1;\n&lt;test&gt;</code></pre><figcaption>Example</figcaption>'
    )
  )
  assert.match(
    markup,
    /<img [^>]*alt="Desk"[^>]*width="960"[^>]*height="500"[^>]*src="https:\/\/i\.ibb\.co\/example\/desk\.png"/
  )
  assert.ok(markup.includes("<figcaption>Working area</figcaption>"))
  assert.equal(schema.searchableBlock(blocks[1]), "Flat item Parent Child")
})
