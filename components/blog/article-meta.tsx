import Image from "next/image"
import { HiOutlineCalendarDays, HiOutlineClock } from "react-icons/hi2"
import { blogAuthor, feedCopy } from "@/data/blog/copy"
import { categories, type BlogPost, type Language } from "@/data/blog/schema"

const dateFormat = {
  en: new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }),
  bn: new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeZone: "UTC",
  }),
}
const minutesFormat = {
  en: new Intl.NumberFormat("en-US"),
  bn: new Intl.NumberFormat("bn-BD"),
}

type ArticleMetaProps = { post: BlogPost; language: Language }

export function ArticleLabels({ post, language }: ArticleMetaProps) {
  return (
    <div className="blog-card-labels">
      <span className="blog-category">
        {categories[post.categories[0]][language]}
      </span>
      <span className="blog-demo-label">{feedCopy[language].demoArticle}</span>
    </div>
  )
}

export function ArticleMeta({ post, language }: ArticleMetaProps) {
  return (
    <div className="blog-meta">
      <div className="blog-card-details">
        <time dateTime={post.date}>
          <HiOutlineCalendarDays aria-hidden="true" />
          {dateFormat[language].format(new Date(`${post.date}T00:00:00Z`))}
        </time>
        <span>
          <HiOutlineClock aria-hidden="true" />
          {feedCopy[language].readTime(
            minutesFormat[language].format(post.minutes[language])
          )}
        </span>
      </div>
      <div className="blog-author">
        <span className="blog-avatar">
          <Image
            src="/Confident%20Man%20in%20Charcoal%20Blazer.png"
            width={1672}
            height={941}
            sizes="140px"
            alt=""
          />
        </span>
        {blogAuthor[language]}
      </div>
    </div>
  )
}
