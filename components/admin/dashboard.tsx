"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Award,
  BookOpen,
  ChartNoAxesCombined,
  CircleCheck,
  Eye,
  FolderKanban,
  LayoutGrid,
  Mail,
  Plus,
  UserRound,
} from "lucide-react"
import { analytics, traffic } from "./data"
import { adminHref, routes } from "./routes"
import { useAdmin } from "./store"
import { Heading } from "./ui"

const number = new Intl.NumberFormat("en")
const shortcuts = [
  {
    label: "Create a blog post",
    detail: "Write in English and Bangla",
    href: "/admin/blogs/new",
    icon: Plus,
  },
  {
    label: "Add a project",
    detail: "Showcase recent work",
    href: "/admin/projects?new=1",
    icon: FolderKanban,
  },
  {
    label: "Add a certification",
    detail: "Record a new credential",
    href: "/admin/certifications?new=1",
    icon: Award,
  },
  {
    label: "Update your profile",
    detail: "Edit your bio and social links",
    href: "/admin/profile",
    icon: UserRound,
  },
]
const periods = [
  { value: 6, label: "Last 6 months" },
  { value: 3, label: "Last 3 months" },
]

export function Dashboard() {
  const [period, setPeriod] = useState(6)
  const data = useAdmin()
  const months = analytics.slice(-period)
  const visitors = months.reduce((sum, month) => sum + month.visitors, 0)
  const views = months.reduce((sum, month) => sum + month.views, 0)
  const stats = [
    {
      title: "Total blog posts",
      value: data.blogs.length,
      detail: "All article statuses",
      icon: BookOpen,
      color: "blue",
      href: "/admin/blogs",
    },
    {
      title: "Published articles",
      value: data.blogs.filter((post) => post.status === "Published").length,
      detail: "Published in this demo",
      icon: CircleCheck,
      color: "green",
      href: "/admin/blogs?status=Published",
    },
    {
      title: "Total projects",
      value: data.records.projects.length,
      detail: "Portfolio projects",
      icon: FolderKanban,
      color: "purple",
      href: "/admin/projects",
    },
    {
      title: "Total messages",
      value: data.messages.length,
      detail: `${data.messages.filter((message) => !message.read).length} unread`,
      icon: Mail,
      color: "amber",
      href: "/admin/messages",
    },
    {
      title: "Total certifications",
      value: data.records.certifications.length,
      detail: "Credentials on file",
      icon: Award,
      color: "pink",
      href: "/admin/certifications",
    },
    {
      title: "Total page views",
      value: views,
      detail: "Sample blog page views",
      icon: Eye,
      color: "cyan",
      href: "#analytics",
    },
  ]
  return (
    <div className="admin-stack dashboard">
      <Heading
        title="Dashboard"
        description="Manage your portfolio, publishing, and inbox from one workspace."
      >
        <select
          aria-label="Analytics date range"
          value={period}
          onChange={(event) => setPeriod(Number(event.target.value))}
        >
          {periods.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Heading>
      <section className="admin-hero">
        <div className="admin-hero-content">
          <div className="admin-hero-label">
            <LayoutGrid size={14} /> Demo workspace
          </div>
          <h2>Welcome back, {data.profile.nickname || "Brinto"}.</h2>
          <p>Review your site activity and jump into your next update.</p>
          <Link href="/admin/blogs/new">
            <Plus size={16} /> Create blog post
          </Link>
        </div>
        <div className="admin-hero-art" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <span>
            <ChartNoAxesCombined size={48} strokeWidth={1.4} />
          </span>
        </div>
      </section>
      <section className="admin-metrics" aria-label="Portfolio statistics">
        {stats.map(({ title, value, detail, icon: Icon, color, href }) => (
          <Link key={title} href={href} className="admin-card admin-metric">
            <span className={`admin-metric-icon ${color}`}>
              <Icon size={19} />
            </span>
            <ArrowUpRight size={15} className="admin-metric-arrow" />
            <span>{title}</span>
            <strong>{number.format(value)}</strong>
            <small>{detail}</small>
          </Link>
        ))}
      </section>
      <div className="admin-section-heading" id="analytics">
        <div>
          <h2>Analytics overview</h2>
          <p>Sample traffic and publishing activity for the selected period.</p>
        </div>
      </div>
      <div className="admin-analytics">
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <div>
              <h3>Website visitors</h3>
              <p>Unique visitors per month</p>
            </div>
            <span className="admin-metric-icon blue">
              <Activity size={18} />
            </span>
          </div>
          <div className="admin-chart-total">
            {number.format(visitors)} <small>sample visitors</small>
          </div>
          <div className="admin-chart-main">
            <ResponsiveContainer minWidth={0} width="100%" height="100%">
              <AreaChart
                data={months}
                margin={{ left: -17, top: 12, right: 13 }}
              >
                <defs>
                  <linearGradient
                    id="admin-visitors-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="3%" stopColor="#5a83ff" stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor="#5a83ff"
                      stopOpacity={0.025}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#e9edf6"
                  strokeDasharray="4 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#60708b", fontSize: 12 }}
                />
                <YAxis
                  width={54}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#60708b", fontSize: 11 }}
                />
                <Tooltip />
                <Area
                  name="Visitors"
                  dataKey="visitors"
                  type="monotone"
                  stroke="#315eec"
                  fill="url(#admin-visitors-fill)"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            {months
              .map(({ label, visitors }) => `${label}: ${visitors}`)
              .join(". ")}
          </p>
        </section>
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <div>
              <h3>Traffic overview</h3>
              <p>Sample acquisition channels</p>
            </div>
          </div>
          <div className="admin-donut">
            <ResponsiveContainer minWidth={0} width="100%" height="100%">
              <PieChart>
                <Tooltip formatter={(value) => `${value}%`} />
                <Pie
                  data={traffic}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="63%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                />
              </PieChart>
            </ResponsiveContainer>
            <span aria-hidden="true">
              <strong>100%</strong>
              <small>Traffic</small>
            </span>
          </div>
          <ul className="admin-traffic">
            {traffic.map(({ name, value, fill }) => (
              <li key={name}>
                <i style={{ background: fill }} />
                {name}
                <strong>{value}%</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="admin-analytics even">
        {[
          {
            title: "Blog views",
            detail: "Monthly article page views",
            bars: [{ key: "views", name: "Views", fill: "#4975f3" }],
          },
          {
            title: "Monthly content activity",
            detail: "Articles published and portfolio updates",
            bars: [
              { key: "articles", name: "Articles", fill: "#4975f3" },
              { key: "updates", name: "Updates", fill: "#9fb8ff" },
            ],
          },
        ].map(({ title, detail, bars }) => (
          <section className="admin-card admin-chart-card" key={title}>
            <div className="admin-card-heading">
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </div>
            <div aria-hidden="true" className="admin-chart-legend">
              {bars.map(({ name, fill }) => (
                <span key={name}>
                  <i style={{ background: fill }} />
                  {name}
                </span>
              ))}
            </div>
            <div className="admin-chart-main">
              <ResponsiveContainer minWidth={0} width="100%" height="100%">
                <BarChart
                  data={months}
                  margin={{ left: -17, top: 12, right: 12 }}
                >
                  <CartesianGrid
                    stroke="#e9edf6"
                    strokeDasharray="4 5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#60708b", fontSize: 12 }}
                  />
                  <YAxis
                    width={54}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#60708b", fontSize: 11 }}
                  />
                  <Tooltip />
                  {bars.map(({ key, name, fill }) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      name={name}
                      fill={fill}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={26}
                      isAnimationActive={false}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="sr-only">
              {months
                .map(
                  (month) =>
                    `${month.label}: ${bars.map(({ key, name }) => `${name} ${month[key as "views" | "articles" | "updates"]}`).join(", ")}`
                )
                .join(". ")}
            </p>
          </section>
        ))}
      </div>
      <div className="admin-analytics">
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Updates across your workspace</p>
            </div>
          </div>
          <div className="admin-list dashboard-list">
            {data.activities
              .slice(0, 5)
              .map(({ id, title, detail, section }) => {
                const Icon =
                  routes.find((route) => route.segment === section)?.icon ??
                  Activity
                return (
                  <Link href={adminHref(section)} key={id}>
                    <span className="admin-metric-icon blue">
                      <Icon size={17} />
                    </span>
                    <span>
                      {title}
                      <small>{detail}</small>
                    </span>
                    <ArrowUpRight size={15} />
                  </Link>
                )
              })}
          </div>
        </section>
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Common publishing tasks</p>
            </div>
          </div>
          <div className="admin-list dashboard-list">
            {shortcuts.map(({ label, detail, href, icon: Icon }) => (
              <Link href={href} key={href}>
                <span className="admin-metric-icon blue">
                  <Icon size={17} />
                </span>
                <span>
                  {label}
                  <small>{detail}</small>
                </span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
