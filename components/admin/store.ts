"use client"

import { useSyncExternalStore } from "react"
import { toast } from "sonner"
import {
  publicBlogDemos,
  seed,
  type Activity,
  type AdminData,
  type Blog,
} from "./data"
import { restoreTranslation, type LegacyTranslation } from "./blog-editor-model"

const storageKey = "brinto-admin-demo-v1"
let snapshot: AdminData | undefined
const subscribers = new Set<() => void>()

type LegacyBlog = Omit<Blog, "en" | "bn"> & {
  tags?: string
  en: LegacyTranslation
  bn: LegacyTranslation
}
type LegacySnapshot = Partial<Omit<AdminData, "activities" | "blogs">> & {
  blogs?: LegacyBlog[]
  settings?: unknown
  activities?: (
    Activity | (Omit<Activity, "section"> & { section: "settings" })
  )[]
}

export function readSnapshot(stored: string): AdminData {
  const data = JSON.parse(stored) as LegacySnapshot | null
  if (!data || typeof data !== "object" || Array.isArray(data)) return seed

  delete data.settings
  const activities = Array.isArray(data.activities)
    ? data.activities.filter((activity) => activity.section !== "settings")
    : seed.activities
  const blogs = Array.isArray(data.blogs)
    ? data.blogs.map(({ en, bn, tags, ...blog }): Blog => ({
        ...blog,
        en: restoreTranslation(en, tags),
        bn: restoreTranslation(bn, tags),
      }))
    : seed.blogs
  const ids = new Set(blogs.map((blog) => blog.id))
  return {
    ...seed,
    ...data,
    activities,
    blogSchemaVersion: 1,
    blogs:
      data.blogSchemaVersion === 1
        ? blogs
        : [...blogs, ...publicBlogDemos.filter((blog) => !ids.has(blog.id))],
  }
}

function getSnapshot() {
  if (!snapshot) {
    try {
      const stored = window.localStorage.getItem(storageKey)
      snapshot = stored ? readSnapshot(stored) : seed
    } catch {
      snapshot = seed
    }
  }
  return snapshot
}

function subscribe(listener: () => void) {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

export function useAdmin() {
  return useSyncExternalStore(subscribe, getSnapshot, () => seed)
}

export function saveDemo(
  update: (data: AdminData) => AdminData,
  message?: string,
  activity?: Omit<Activity, "id">
) {
  let next = update(getSnapshot())
  if (activity) {
    next = {
      ...next,
      activities: [
        { ...activity, id: crypto.randomUUID() },
        ...next.activities,
      ].slice(0, 15),
      unreadActivities: true,
    }
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  } catch {
    toast.error(
      "Could not save to browser storage. Check available space and try again."
    )
    return false
  }
  snapshot = next
  subscribers.forEach((listener) => listener())
  if (message) toast.success(message)
  return true
}
