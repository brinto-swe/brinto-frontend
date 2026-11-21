import type { Metadata } from "next"
import { BlogFeed } from "@/components/blog/blog-feed"
import { blogBengali } from "@/lib/blog-font"
import "../portfolio.css"
import "./blogs.css"
import "./article-prose.css"

export const metadata: Metadata = {
  title: "Insights & Articles | Brinto.dev",
  description:
    "Read Brinto.dev’s bilingual demo articles on AI, web development, and software engineering in English and Bangla.",
}

export default function BlogsPage() {
  return <BlogFeed fontClass={blogBengali.variable} />
}
