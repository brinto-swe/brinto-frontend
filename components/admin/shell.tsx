"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CodeXml,
  LogOut,
  PanelLeft,
  Search,
  UserRound,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Toaster } from "sonner"
import { signOut } from "@/lib/auth-client"
import { adminHref, routes } from "./routes"
import { saveDemo, useAdmin } from "./store"
import { Button, Confirm, Empty, Modal, safeUrl } from "./ui"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    profile,
    documents,
    messages,
    records,
    blogs,
    activities,
    unreadActivities,
  } = useAdmin()
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [dialog, setDialog] = useState<
    "search" | "notifications" | "exit" | null
  >(null)
  const [query, setQuery] = useState("")
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")

  function openLogout() {
    setLogoutError("")
    setDialog("exit")
  }

  async function logout() {
    if (signingOut) return
    setSigningOut(true)
    setLogoutError("")
    try {
      const result = await signOut()
      if (!result.error && result.data?.success) {
        window.location.replace("/login")
        return
      }
    } catch {
      // Keep the confirmation open so the owner can retry.
    }
    setLogoutError("Couldn’t confirm sign-out. Please try again.")
    setSigningOut(false)
  }

  const [, , segment = "", item] = pathname.split("/")
  const current = routes.find((route) => route.segment === segment)
  const title =
    segment === "blogs" && item
      ? item === "new"
        ? "New blog post"
        : "Edit blog post"
      : (current?.label ?? "Workspace")
  const unread = messages.filter((message) => !message.read).length
  const searchItems = [
    ...routes.map(({ segment, label }) => ({
      label,
      href: adminHref(segment),
      category: "Page",
    })),
    ...blogs.map((blog) => ({
      label: blog.en.title || blog.bn.title || "Untitled article",
      href: `/admin/blogs/${blog.id}/edit`,
      category: "Blog",
    })),
    ...Object.entries(records).flatMap(([section, collection]) =>
      collection.map((record) => ({
        label: record.values.title,
        href: `/admin/${section}?find=${encodeURIComponent(record.values.title)}`,
        category:
          routes.find((route) => route.segment === section)?.label ?? "Content",
      }))
    ),
    ...messages.map((message) => ({
      label: message.subject,
      href: `/admin/messages?find=${encodeURIComponent(message.subject)}`,
      category: "Message",
    })),
    ...Object.values(documents).flatMap((document) =>
      document
        ? [
            {
              label: document.name,
              href: "/admin/resume",
              category: "Document",
            },
          ]
        : []
    ),
  ]
  const matches = searchItems
    .filter(({ label, category }) =>
      `${label} ${category}`.toLowerCase().includes(query.trim().toLowerCase())
    )
    .slice(0, 10)
  const avatar = (
    <Avatar className="admin-avatar">
      <AvatarImage src={safeUrl(profile.photo)} alt="" />
      <AvatarFallback>{(profile.nickname || "B").slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
  const sidebar = (close?: () => void) => (
    <div className="admin-sidebar-body">
      <Link href="/admin" className="admin-logo" onClick={close}>
        <span className="admin-logo-mark">
          <CodeXml size={21} />
        </span>
        <span className="admin-nav-text">
          <strong>
            Brinto<span>.dev</span>
          </strong>
          <small>Admin workspace</small>
        </span>
      </Link>
      <nav aria-label="Admin sections" className="admin-nav">
        {routes.map(({ segment: key, label, icon: Icon, group }, index) => (
          <div key={label}>
            {routes[index - 1]?.group !== group && (
              <p className="admin-nav-group">{group}</p>
            )}
            <Link
              href={adminHref(key)}
              onClick={close}
              className="admin-nav-link"
              aria-current={segment === key ? "page" : undefined}
              aria-label={label}
              title={label}
            >
              <Icon size={18} />
              <span className="admin-nav-text">{label}</span>
              {key === "messages" && unread > 0 && (
                <span className="admin-nav-count">{unread}</span>
              )}
            </Link>
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-bottom">
        <Link
          href="/"
          className="admin-nav-link"
          onClick={close}
          title="View public site"
          aria-label="View public site"
        >
          <ArrowUpRight size={18} />
          <span className="admin-nav-text">View public site</span>
        </Link>
        <div className="admin-user">
          {avatar}
          <span className="admin-nav-text">
            <strong>{profile.nickname || "Brinto"}</strong>
            <small>Demo workspace</small>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => {
              close?.()
              openLogout()
            }}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
  return (
    <div
      className={`admin-surface admin-shell ${collapsed ? "collapsed" : ""}`}
    >
      <a href="#admin-main" className="admin-skip">
        Skip to main content
      </a>
      <aside className="admin-sidebar">{sidebar()}</aside>
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="admin-surface admin-drawer">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Choose a workspace section.
          </SheetDescription>
          {sidebar(() => setDrawer(false))}
        </SheetContent>
      </Sheet>
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <Button
              variant="ghost"
              size="icon-sm"
              className="admin-desktop-toggle"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeft size={19} />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="admin-mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setDrawer(true)}
            >
              <PanelLeft size={19} />
            </Button>
            <nav aria-label="Breadcrumb" className="admin-breadcrumb">
              <Link href="/admin">Workspace</Link>
              <ChevronRight size={14} />
              {item && current && (
                <>
                  <Link href={adminHref(current.segment)}>{current.label}</Link>
                  <ChevronRight size={14} />
                </>
              )}
              <span aria-current="page">{title}</span>
            </nav>
          </div>
          <div className="admin-header-right">
            <Button
              variant="outline"
              className="admin-search-trigger"
              aria-label="Search workspace"
              onClick={() => {
                setQuery("")
                setDialog("search")
              }}
            >
              <Search size={16} />
              <span>Search workspace</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="admin-notification"
              aria-label={
                unreadActivities
                  ? "Notifications, new activity"
                  : "Notifications"
              }
              onClick={() => setDialog("notifications")}
            >
              <Bell size={18} />
              {unreadActivities && <i />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="admin-avatar-trigger"
                    aria-label="Account menu"
                  />
                }
              >
                {avatar}
                <ChevronDown size={13} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="admin-surface admin-account-menu"
              >
                <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                  <UserRound size={15} />
                  Profile settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openLogout}>
                  <LogOut size={15} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main id="admin-main" className="admin-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="admin-footer">
          <span>Brinto.dev workspace</span>
          <span>Demo mode · Browser storage only</span>
        </footer>
      </div>
      <Modal
        title="Search workspace"
        description="Find a workspace page, article, content item, or message."
        open={dialog === "search"}
        onClose={() => setDialog(null)}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          aria-label="Search query"
        />
        <div className="admin-list">
          {matches.length ? (
            matches.map(({ label, href, category }) => (
              <Link
                key={`${category}-${label}-${href}`}
                href={href}
                onClick={() => setDialog(null)}
              >
                <span>{label}</span>
                <small>{category}</small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </Modal>
      <Modal
        title="Notifications"
        description="Recent activity in this demo workspace."
        open={dialog === "notifications"}
        onClose={() => setDialog(null)}
      >
        {unreadActivities && (
          <div className="admin-actions">
            <Button
              variant="outline"
              onClick={() =>
                saveDemo(
                  (state) => ({ ...state, unreadActivities: false }),
                  "Notifications marked as read"
                )
              }
            >
              Mark all as read
            </Button>
          </div>
        )}
        <div className="admin-list">
          {activities.slice(0, 7).map(({ id, title, detail, section }) => (
            <Link
              key={id}
              href={adminHref(section)}
              onClick={() => setDialog(null)}
            >
              <span>
                {title}
                <small>{detail}</small>
              </span>
              <ChevronRight size={15} />
            </Link>
          ))}
        </div>
      </Modal>
      <Confirm
        title="Sign out of Brinto.dev?"
        description="You’ll return to the sign-in page."
        confirmLabel={signingOut ? "Signing out…" : "Sign out"}
        open={dialog === "exit"}
        onClose={() => setDialog(null)}
        onConfirm={logout}
        pending={signingOut}
        error={logoutError}
      />
      <Toaster theme="light" position="bottom-right" richColors />
    </div>
  )
}
