import { notFound } from "next/navigation"
import { routes } from "@/components/admin/routes"
import { Workspace } from "@/components/admin/workspace"
import { requireOwnerSession } from "@/lib/owner-session"
import { AdminAccessMessage } from "../access-message"

type Query = Record<string, string | string[] | undefined>
const stringValue = (value: Query[string]) =>
  typeof value === "string" ? value : ""

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>
  searchParams: Promise<Query>
}) {
  if (await requireOwnerSession() === "unavailable") {
    return <AdminAccessMessage unavailable />
  }
  const { path = [] } = await params
  const [section = "", id, action] = path
  if (section === "blogs" && path.length === 2 && id === "new")
    return <Workspace key="new-blog" section="editor" />
  if (section === "blogs" && path.length === 3 && id && action === "edit")
    return <Workspace key={id} section="editor" id={id} />
  const route = routes.find((item) => item.segment === section)
  if (!route || path.length > 1 || (path.length === 1 && !section)) notFound()
  const query = await searchParams
  const find = stringValue(query.find)
  const status = stringValue(query.status)
  const create = query.new === "1"
  return (
    <Workspace
      key={JSON.stringify([section, find, status, create])}
      section={route.segment}
      find={find}
      status={status}
      create={create}
    />
  )
}
