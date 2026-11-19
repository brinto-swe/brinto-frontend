"use client"

import Image from "next/image"
import { useRef, useState, useSyncExternalStore } from "react"
import {
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Wave } from "@/components/shared/portfolio-ui"
import { PortfolioMotion } from "@/components/shared/portfolio-motion"
import { ArticleCard } from "./article-card"
import { ArticleDialog } from "./article-dialog"
import { BlogLanguage, blogLanguages } from "./blog-language"
import { Dialog } from "@/components/ui/dialog"
import { blogAuthor, feedCopy } from "@/data/blog/copy"
import { blogPosts } from "@/data/blog/posts"
import {
  categories,
  searchableBlock,
  type BlogPost,
  type Category,
  type Language,
} from "@/data/blog/schema"

const categoryKeys = Object.keys(categories) as Category[]
const pageSize = 6
const languageKey = "brinto-blog-language"
const languageChange = "brinto-blog-language-change"
const numberFormat = {
  en: new Intl.NumberFormat("en-US"),
  bn: new Intl.NumberFormat("bn-BD"),
}
let sessionLanguage: Language = "en"

function subscribeLanguage(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== null && event.key !== languageKey) return
    sessionLanguage = event.newValue === "bn" ? "bn" : "en"
    notify()
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener(languageChange, notify)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(languageChange, notify)
  }
}

function getLanguage(): Language {
  try {
    const preference = window.localStorage.getItem(languageKey)
    return preference === "bn" || preference === "en"
      ? preference
      : sessionLanguage
  } catch {
    return sessionLanguage
  }
}

function setLanguage(language: Language) {
  sessionLanguage = language
  try {
    window.localStorage.setItem(languageKey, language)
  } catch {
    // A storage-restricted browser can still switch languages for this visit.
  }
  window.dispatchEvent(new Event(languageChange))
}

function subscribeHash(notify: () => void) {
  window.addEventListener("hashchange", notify)
  return () => window.removeEventListener("hashchange", notify)
}

function setArticleHash(id?: string) {
  const url = new URL(window.location.href)
  url.hash = id ?? ""
  window.history.replaceState(window.history.state, "", url)
  window.dispatchEvent(new Event("hashchange"))
}

function normalize(text: string) {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\u200B-\u200D]/g, "")
}

const indexedPosts = blogPosts.map((post) => ({
  post,
  text: normalize(
    blogLanguages
      .flatMap((language) => [
        blogAuthor[language],
        post.title[language],
        post.excerpt[language],
        ...post.tags[language],
        ...post.content[language].map(searchableBlock),
      ])
      .join(" ")
  ),
}))

export function BlogFeed({ fontClass }: { fontClass: string }) {
  const language = useSyncExternalStore<Language>(
    subscribeLanguage,
    getLanguage,
    () => "en"
  )
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  )
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category | "all">("all")
  const [limit, setLimit] = useState(pageSize)
  const [closingArticle, setClosingArticle] = useState<BlogPost | null>(null)
  const searchField = useRef<HTMLInputElement>(null)
  const copy = feedCopy[language]
  const number = numberFormat[language]
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const matching = indexedPosts.filter(({ text }) =>
    words.every((word) => text.includes(word))
  )
  const filtered = matching.filter(
    ({ post }) => category === "all" || post.categories.includes(category)
  )
  const visible = filtered.slice(0, limit)
  const selectedArticle = blogPosts.find(({ id }) => id === hash)
  const readerArticle = selectedArticle ?? closingArticle

  function updateQuery(value: string) {
    setQuery(value)
    setLimit(pageSize)
  }

  function updateCategory(value: Category | "all") {
    setCategory(value)
    setLimit(pageSize)
  }

  function clearSearch() {
    updateQuery("")
    searchField.current?.focus()
  }

  return (
    <Dialog
      open={Boolean(selectedArticle)}
      triggerId={readerArticle ? `read-${readerArticle.id}` : null}
      onOpenChange={(open, { trigger }) => {
        if (open) {
          const id = trigger?.getAttribute("data-article-id")
          if (id) setArticleHash(id)
        } else if (selectedArticle) {
          setClosingArticle(selectedArticle)
          setArticleHash()
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) setClosingArticle(null)
      }}
    >
      <div className={`portfolio blog-page ${fontClass}`} lang={language}>
        <a className="skip-link" href="#blog-results">
          {copy.skip}
        </a>
        <Navbar blogLanguage={language} />
        <main>
          <section className="blog-hero" aria-labelledby="blog-title">
            <div className="blog-container blog-hero-grid">
              <div className="blog-hero-topline">
                <span className="section-label">
                  <HiOutlineBookOpen aria-hidden="true" />
                  {copy.badge}
                </span>
                {!selectedArticle && (
                  <BlogLanguage language={language} onChange={setLanguage} />
                )}
              </div>
              <div className="blog-hero-copy">
                <h1 id="blog-title">
                  {copy.title} <span>{copy.accent}</span>
                </h1>
                <p>{copy.intro}</p>
              </div>
              <Image
                className="blog-hero-art"
                src="/blog/desk.webp"
                alt=""
                width={960}
                height={492}
                preload
                sizes="(max-width: 560px) 80vw, (max-width: 900px) 36vw, 400px"
              />
            </div>
            <Wave className="blog-hero-wave" />
          </section>
          <section
            className="blog-container blog-content"
            id="blog-results"
            aria-label={copy.allResults}
            tabIndex={-1}
          >
            <div className="blog-toolbar">
              <div className="blog-search" role="search">
                <HiOutlineMagnifyingGlass aria-hidden="true" />
                <input
                  ref={searchField}
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.currentTarget.value)}
                  aria-label={copy.search}
                  placeholder={copy.search}
                />
                {query && (
                  <button
                    type="button"
                    aria-label={copy.clear}
                    onClick={clearSearch}
                  >
                    <HiOutlineXMark aria-hidden="true" />
                  </button>
                )}
              </div>
              <div
                className="blog-filters"
                role="group"
                aria-label={copy.filters}
              >
                {(["all", ...categoryKeys] as const).map((key) => {
                  const label =
                    key === "all" ? copy.all : categories[key][language]
                  const count =
                    key === "all"
                      ? matching.length
                      : matching.filter(({ post }) =>
                          post.categories.includes(key)
                        ).length
                  return (
                    <button
                      type="button"
                      key={key}
                      aria-pressed={key === category}
                      onClick={() => updateCategory(key)}
                    >
                      {label}{" "}
                      <span aria-hidden="true">{number.format(count)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="blog-result-line">
              <p role="status">
                {copy.results(
                  number.format(visible.length),
                  number.format(filtered.length)
                )}
              </p>
              <span>{copy.demo}</span>
            </div>
            {visible.length > 0 ? (
              <>
                <div className="blog-grid">
                  {visible.map(({ post }) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      language={language}
                    />
                  ))}
                </div>
                <div className="blog-pagination">
                  {visible.length < filtered.length && (
                    <button
                      className="portfolio-button portfolio-button--outline"
                      type="button"
                      onClick={() => setLimit(visible.length + pageSize)}
                    >
                      {copy.more}
                    </button>
                  )}
                  <p role="status">
                    {visible.length === filtered.length && copy.end}
                  </p>
                </div>
              </>
            ) : (
              <div className="portfolio-card blog-empty">
                <HiOutlineMagnifyingGlass aria-hidden="true" />
                <h2>{copy.empty}</h2>
                <p>{copy.emptyHint}</p>
                <button
                  className="portfolio-button portfolio-button--outline"
                  type="button"
                  onClick={() => {
                    clearSearch()
                    updateCategory("all")
                  }}
                >
                  {copy.reset}
                </button>
              </div>
            )}
          </section>
        </main>
        <Footer blogLanguage={language} />
        <PortfolioMotion />
      </div>
      {readerArticle && (
        <ArticleDialog
          key={readerArticle.id}
          post={readerArticle}
          language={language}
          fontClass={fontClass}
          open={Boolean(selectedArticle)}
          onLanguageChange={setLanguage}
          finalFocus={() =>
            document.getElementById(`read-${readerArticle.id}`) ??
            searchField.current
          }
        />
      )}
    </Dialog>
  )
}
