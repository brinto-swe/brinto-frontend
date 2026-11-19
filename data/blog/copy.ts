import { profile } from "@/data/portfolio"
import type { Localized } from "./schema"

export const blogAuthor = { en: profile.name, bn: "কে এম মোজাদ্দেদুল ইসলাম" }

type FeedCopy = {
  badge: string
  title: string
  accent: string
  intro: string
  languages: string
  search: string
  clear: string
  filters: string
  all: string
  demo: string
  demoArticle: string
  allResults: string
  results: (visible: string, total: string) => string
  empty: string
  emptyHint: string
  reset: string
  more: string
  end: string
  readMore: string
  close: string
  articleBody: string
  readTime: (minutes: string) => string
  share: string
  copy: string
  copied: string
  manualCopy: string
  link: string
  tags: string
  skip: string
}

export const feedCopy: Localized<FeedCopy> = {
  en: {
    badge: "Blogs",
    title: "Insights",
    accent: "& Articles",
    intro:
      "Thoughts, tutorials, research notes, and experiments on AI, web development, and modern software engineering.",
    languages: "Reading language",
    search: "Search articles…",
    clear: "Clear search",
    filters: "Filter by category",
    all: "All Posts",
    demo: "Demo articles",
    demoArticle: "Demo",
    allResults: "All posts",
    results: (visible, total) => `Showing ${visible} of ${total} posts`,
    empty: "No matching articles",
    emptyHint: "Try a different search term or choose another category.",
    reset: "Reset filters",
    more: "Load More Posts",
    end: "You’ve reached the end of the feed.",
    readMore: "Read More",
    close: "Close article",
    articleBody: "Article body",
    readTime: (minutes) => `${minutes} min read`,
    share: "Share",
    copy: "Copy Link",
    copied: "Article link copied.",
    manualCopy:
      "Automatic copy is unavailable. Select and copy the link below.",
    link: "Article link",
    tags: "Article tags",
    skip: "Skip to articles",
  },
  bn: {
    badge: "ব্লগ",
    title: "ভাবনা",
    accent: "ও নিবন্ধ",
    intro:
      "কৃত্রিম বুদ্ধিমত্তা, ওয়েব ডেভেলপমেন্ট ও আধুনিক সফটওয়্যার প্রকৌশল নিয়ে ভাবনা, টিউটোরিয়াল, গবেষণার নোট ও পরীক্ষা-নিরীক্ষা।",
    languages: "পড়ার ভাষা",
    search: "নিবন্ধ খুঁজুন…",
    clear: "অনুসন্ধান মুছুন",
    filters: "বিষয় অনুযায়ী ছাঁকুন",
    all: "সব লেখা",
    demo: "নমুনা নিবন্ধ",
    demoArticle: "নমুনা",
    allResults: "সব লেখা",
    results: (visible, total) =>
      `মোট ${total}টি লেখার মধ্যে ${visible}টি দেখানো হচ্ছে`,
    empty: "মিলে যায় এমন নিবন্ধ নেই",
    emptyHint: "ভিন্ন শব্দ দিয়ে খুঁজুন অথবা অন্য বিষয় বেছে নিন।",
    reset: "ফিল্টার সরান",
    more: "আরও লেখা দেখুন",
    end: "সব লেখা দেখানো হয়েছে।",
    readMore: "আরো পড়ুন",
    close: "নিবন্ধ বন্ধ করুন",
    articleBody: "নিবন্ধের মূল লেখা",
    readTime: (minutes) => `পড়তে ${minutes} মিনিট`,
    share: "শেয়ার",
    copy: "লিংক কপি",
    copied: "নিবন্ধের লিংক কপি হয়েছে।",
    manualCopy: "স্বয়ংক্রিয়ভাবে কপি করা যায়নি। নিচের লিংকটি নির্বাচন করে কপি করুন।",
    link: "নিবন্ধের লিংক",
    tags: "নিবন্ধের ট্যাগ",
    skip: "নিবন্ধে যান",
  },
}

export const banglaNavigation = {
  Home: "হোম",
  About: "পরিচিতি",
  Education: "শিক্ষা",
  Skills: "দক্ষতা",
  Projects: "প্রকল্প",
  Certifications: "সনদ",
  Blogs: "ব্লগ",
  Contact: "যোগাযোগ",
}
