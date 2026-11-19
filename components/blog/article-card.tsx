import { useState } from "react"
import { HiArrowUpRight, HiOutlineLink, HiOutlineShare } from "react-icons/hi2"
import { DialogTrigger } from "@/components/ui/dialog"
import { ArticleLabels, ArticleMeta } from "./article-meta"
import {
  copyArticleLink,
  shareArticle,
  type ShareFeedback,
} from "./article-sharing"
import { feedCopy } from "@/data/blog/copy"
import type { BlogPost, Language } from "@/data/blog/schema"

function articleUrl(id: string) {
  const url = new URL(window.location.href)
  url.search = ""
  url.hash = id
  return url.toString()
}

function ShareActions({
  post,
  language,
}: {
  post: BlogPost
  language: Language
}) {
  const [feedback, setFeedback] = useState<ShareFeedback | null>(null)
  const copy = feedCopy[language]

  async function share() {
    const url = articleUrl(post.id)
    setFeedback(null)
    setFeedback(await shareArticle(navigator, post.title[language], url))
  }

  return (
    <>
      <div className="blog-share-actions">
        <button type="button" onClick={share}>
          <HiOutlineShare aria-hidden="true" />
          {copy.share}
        </button>
        <button
          type="button"
          onClick={async () =>
            setFeedback(await copyArticleLink(navigator, articleUrl(post.id)))
          }
        >
          <HiOutlineLink aria-hidden="true" />
          {copy.copy}
        </button>
      </div>
      <div className="blog-share-feedback" role="status">
        {feedback?.kind === "copied" && copy.copied}
        {feedback?.kind === "manual" && (
          <>
            {copy.manualCopy}
            <input
              type="url"
              readOnly
              value={feedback.url}
              aria-label={copy.link}
              onFocus={(event) => event.currentTarget.select()}
            />
          </>
        )}
      </div>
    </>
  )
}

export function ArticleCard({
  post,
  language,
}: {
  post: BlogPost
  language: Language
}) {
  const copy = feedCopy[language]
  const headingId = `${post.id}-title`
  const cover = post.cover

  return (
    <article aria-labelledby={headingId} className="blog-card portfolio-card">
      <header className="blog-card-top">
        {cover !== undefined && (
          <div
            className="blog-thumbnail"
            aria-hidden="true"
            style={{
              backgroundPosition: `${(cover % 3) * 50}% ${cover < 3 ? "12.5%" : "87.5%"}`,
            }}
          />
        )}
        <div className="blog-card-meta">
          <ArticleLabels post={post} language={language} />
          <ArticleMeta post={post} language={language} />
        </div>
      </header>
      <h2 id={headingId}>{post.title[language]}</h2>
      <p className="blog-excerpt">{post.excerpt[language]}</p>
      <ul className="blog-tags" aria-label={copy.tags}>
        {post.tags[language].map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="blog-card-tools">
        <DialogTrigger
          id={`read-${post.id}`}
          data-article-id={post.id}
          className="blog-read"
        >
          {copy.readMore}
          <HiArrowUpRight aria-hidden="true" />
        </DialogTrigger>
        <ShareActions post={post} language={language} />
      </div>
    </article>
  )
}
