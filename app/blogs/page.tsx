import type { Metadata } from "next"
import { Noto_Sans_Bengali } from "next/font/google"
import { BlogFeed } from "@/components/blog/blog-feed"
import "../portfolio.css"
import "./blogs.css"

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: "variable",
  variable: "--font-blog-bengali",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "Insights & Articles | Brinto.dev",
  description:
    "Read Brinto.dev’s bilingual demo articles on AI, web development, and software engineering in English and Bangla.",
}

export default function BlogsPage() {
  return <BlogFeed fontClass={bengali.variable} />
}
