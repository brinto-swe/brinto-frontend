import { useRef } from "react"
import { HiOutlineXMark } from "react-icons/hi2"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { feedCopy } from "@/data/blog/copy"
import type { BlogPost, Language } from "@/data/blog/schema"
import { ArticleContent } from "./article-content"
import { ArticleLabels, ArticleMeta } from "./article-meta"
import { BlogLanguage } from "./blog-language"

export function ArticleDialog({
  post,
  language,
  fontClass,
  open,
  onLanguageChange,
  finalFocus,
}: {
  post: BlogPost
  language: Language
  fontClass: string
  open: boolean
  onLanguageChange: (language: Language) => void
  finalFocus: () => HTMLElement | null
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  const copy = feedCopy[language]

  return (
    <DialogContent
      className={`blog-reader ${fontClass}`}
      lang={language}
      aria-modal="true"
      showCloseButton={false}
      initialFocus={heading}
      finalFocus={finalFocus}
    >
      <DialogHeader className="blog-reader-header">
        <div className="blog-reader-topline">
          <ArticleLabels post={post} language={language} />
          <div className="blog-reader-controls">
            {open && (
              <BlogLanguage language={language} onChange={onLanguageChange} />
            )}
            <DialogClose
              className="blog-reader-close"
              aria-label={copy.close}
              title={copy.close}
            >
              <HiOutlineXMark aria-hidden="true" />
            </DialogClose>
          </div>
        </div>
        <DialogTitle
          render={<h1 />}
          ref={heading}
          tabIndex={-1}
          className="blog-reader-title"
        >
          {post.title[language]}
        </DialogTitle>
        <ArticleMeta post={post} language={language} />
        <DialogDescription className="sr-only">
          {post.excerpt[language]}
        </DialogDescription>
      </DialogHeader>
      <div
        className="blog-reader-body"
        tabIndex={0}
        role="region"
        aria-label={copy.articleBody}
      >
        <div className="blog-prose">
          <p className="blog-reader-lead">{post.excerpt[language]}</p>
          <ArticleContent blocks={post.content[language]} />
        </div>
      </div>
    </DialogContent>
  )
}
