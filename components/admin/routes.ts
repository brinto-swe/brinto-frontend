import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Layers3,
  Award,
  FileText,
  Mail,
  UserRound,
} from "lucide-react"

export const routes = [
  {
    segment: "",
    label: "Dashboard",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  { segment: "blogs", label: "Blogs", icon: BookOpen, group: "Content" },
  {
    segment: "projects",
    label: "Projects",
    icon: FolderKanban,
    group: "Content",
  },
  {
    segment: "education",
    label: "Education",
    icon: GraduationCap,
    group: "Content",
  },
  { segment: "skills", label: "Skills", icon: Layers3, group: "Content" },
  {
    segment: "certifications",
    label: "Certifications",
    icon: Award,
    group: "Content",
  },
  { segment: "resume", label: "Resume & CV", icon: FileText, group: "Content" },
  {
    segment: "messages",
    label: "Messages",
    icon: Mail,
    group: "Communication",
  },
  {
    segment: "profile",
    label: "Profile Settings",
    icon: UserRound,
    group: "Configuration",
  },
] as const

export type Section = (typeof routes)[number]["segment"]
export const adminHref = (segment: Section) =>
  segment ? `/admin/${segment}` : "/admin"
