"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { type Section } from "./routes"
import { Blogs, Editor } from "./blogs"
import { CollectionManager } from "./collections"
import { Documents, Messages, SettingsForm } from "./settings"

const Dashboard = dynamic(
  () => import("./dashboard").then((module) => module.Dashboard),
  {
    loading: () => (
      <div className="admin-stack" role="status">
        <span className="sr-only">Loading dashboard</span>
        <Skeleton className="h-12 w-52" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    ),
  }
)

export function Workspace({
  section,
  id,
  find = "",
  status = "",
  create = false,
}: {
  section: Section | "editor"
  id?: string
  find?: string
  status?: string
  create?: boolean
}) {
  switch (section) {
    case "":
      return <Dashboard />
    case "editor":
      return <Editor id={id} />
    case "blogs":
      return <Blogs status={status} />
    case "messages":
      return <Messages find={find} />
    case "resume":
      return <Documents />
    case "profile":
    case "settings":
      return <SettingsForm section={section} />
    default:
      return (
        <CollectionManager collection={section} find={find} create={create} />
      )
  }
}
