import { profile, researchAreas } from "@/data/portfolio"

export type BlogStatus = "Draft" | "Published" | "Archived"
type Language = { title: string; excerpt: string; article: string }
export type Blog = {
  id: string
  cover: string
  category: string
  author: string
  date: string
  tags: string
  status: BlogStatus
  en: Language
  bn: Language
}
export type RecordData = { id: string; values: Record<string, string> }
export type Collection = "projects" | "education" | "skills" | "certifications"
export type Message = {
  id: string
  name: string
  email: string
  subject: string
  body: string
  date: string
  read: boolean
}
export type DocumentData = {
  name: string
  size: number
  date: string
  data: string
}
export type DocumentKind = "resume" | "cv"
export type Activity = {
  id: string
  title: string
  detail: string
  section:
    | "blogs"
    | "projects"
    | "certifications"
    | "messages"
    | "profile"
    | "settings"
    | "education"
    | "skills"
    | "resume"
}
export type AdminData = {
  blogs: Blog[]
  records: Record<Collection, RecordData[]>
  skillCategories: string[]
  messages: Message[]
  profile: Record<string, string>
  settings: Record<string, string>
  documents: Record<DocumentKind, DocumentData | null>
  activities: Activity[]
  unreadActivities: boolean
}

export const portrait = "/Professional%20Portrait%20Cutout.png"
export const blogCategories = [
  "AI",
  "Machine Learning",
  "Web Development",
  "Research",
  "Tutorials",
]
export const blogStatuses: BlogStatus[] = ["Draft", "Published", "Archived"]
export const projectCategories = [
  "Web Development",
  "AI / ML",
  "Full-Stack",
  "Academic",
]
export const homepageSections = [
  "Hero",
  "About",
  "Education",
  "Skills",
  "Projects",
  "Certifications",
  "Blogs",
  "Contact",
  "Footer",
]
export const today = () => new Date().toISOString().slice(0, 10)
export const formatDate = (value: string) =>
  value
    ? Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(value))
    : "—"

const sampleBlogs = [
  [
    "Introduction to Neuro-Symbolic AI",
    "নিউরো-সিম্বলিক এআইয়ের পরিচিতি",
    "AI",
    "Published",
    "Neural networks learn patterns. Symbolic systems help us reason about them.",
  ],
  [
    "Agricultural Computer Vision",
    "কৃষিতে কম্পিউটার ভিশন",
    "Research",
    "Published",
    "How visual models can support crop monitoring in the field.",
  ],
  [
    "Building Scalable Apps with Next.js",
    "Next.js দিয়ে স্কেলযোগ্য অ্যাপ তৈরি",
    "Web Development",
    "Published",
    "Practical ways to organize growing applications.",
  ],
  [
    "Evaluating Small Image Datasets",
    "ছোট চিত্র ডেটাসেটের মূল্যায়ন",
    "Machine Learning",
    "Draft",
    "A checklist for comparing image models on limited samples.",
  ],
  [
    "Notes on Accessible Forms",
    "অ্যাক্সেসযোগ্য ফর্ম নিয়ে কিছু কথা",
    "Tutorials",
    "Draft",
    "A guide to labels, input errors, and keyboard interactions.",
  ],
  [
    "Working with Research Baselines",
    "গবেষণার বেসলাইন নিয়ে কাজ",
    "Research",
    "Archived",
    "An early outline for choosing comparison methods.",
  ],
  [
    "A Practical Guide to Model Metrics",
    "মডেলের মেট্রিক্সের ব্যবহারিক নির্দেশিকা",
    "Machine Learning",
    "Published",
    "What common metrics tell us about a model in practice.",
  ],
] as const

const records: AdminData["records"] = {
  projects: [
    {
      id: "booknook",
      values: {
        title: "BookNook",
        category: "Full-Stack",
        stack: "Next.js, Node.js, MongoDB",
        description:
          "A library management platform for browsing and borrowing books.",
        featured: "true",
        image: "/project-reference.png",
      },
    },
    {
      id: "medxray",
      values: {
        title: "Smart Medical Image Diagnosis",
        category: "AI / ML",
        stack: "Python, PyTorch, Django",
        description:
          "An experimental chest X-ray classification project with explainable visualizations.",
        featured: "true",
      },
    },
    {
      id: "fameno",
      values: {
        title: "Famenoor Store",
        category: "Web Development",
        stack: "React, Django, PostgreSQL",
        description: "A storefront concept with a responsive product catalog.",
      },
    },
  ],
  education: [
    {
      id: "yzu",
      values: {
        title: "Yangzhou University",
        degree: "Master of Engineering",
        department: "Engineering",
        start: "",
        current: "true",
        description: "Graduate studies with a focus on applied AI.",
        research: researchAreas.join(", "),
      },
    },
  ],
  skills: [
    ["React", "Frontend Development", "Code"],
    ["Next.js", "Frontend Development", "Code"],
    ["Django", "Backend Development", "Server"],
    ["MongoDB", "Databases", "Database"],
    ["Git", "Tools & DevOps", "Git"],
    ["PyTorch", "AI / Machine Learning", "Brain"],
    ["Linux", "Others", "Terminal"],
  ].map(([title, category, icon], index) => ({
    id: `skill-${index}`,
    values: {
      title,
      category,
      icon,
      order: String(index + 1),
      visible: "true",
    },
  })),
  certifications: [
    {
      id: "demo-cloud",
      values: {
        title: "Cloud Practitioner Essentials",
        issuer: "Demo training provider",
        date: "2025-03-01",
        credential: "DEMO-CLOUD-001",
        visible: "true",
      },
    },
    {
      id: "demo-docker",
      values: {
        title: "Docker Essentials",
        issuer: "Demo training provider",
        date: "2025-01-01",
        credential: "DEMO-DOCKER-002",
        visible: "true",
      },
    },
  ],
}

function samplePdf(title: string): DocumentData {
  const stream = `BT /F1 22 Tf 48 740 Td (Brinto.dev - Sample ${title}) Tj 0 -36 Td /F1 12 Tf (Demo document for the admin workspace.) Tj ET`
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = objects.map((object, index) => {
    const offset = pdf.length
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    return String(offset).padStart(10, "0") + " 00000 n \n"
  })
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${pdf.length}\n%%EOF\n`
  return {
    name: `brinto-demo-${title.toLowerCase()}.pdf`,
    size: pdf.length,
    date: "2026-11-08",
    data: `data:application/pdf,${encodeURIComponent(pdf)}`,
  }
}

export const seed: AdminData = {
  blogs: sampleBlogs.map(([title, bn, category, status, excerpt], index) => ({
    id: `article-${index + 1}`,
    author: "Brinto",
    category,
    status,
    cover: "/blog/desk.webp",
    date: `2026-11-${String(16 - index).padStart(2, "0")}`,
    tags: category,
    en: {
      title,
      excerpt,
      article: `## Overview\n\n${excerpt}\n\n> An example article for the admin workspace.\n\n- Start with a concrete question\n- Record and compare the results`,
    },
    bn: {
      title: bn,
      excerpt: "অ্যাডমিন ড্যাশবোর্ডের জন্য একটি নমুনা নিবন্ধ।",
      article:
        "## সংক্ষিপ্ত বিবরণ\n\nএই লেখাটি বাংলা সম্পাদক পরীক্ষা করার জন্য একটি নমুনা।",
    },
  })),
  records,
  skillCategories: [
    "Frontend Development",
    "Backend Development",
    "Databases",
    "Tools & DevOps",
    "AI / Machine Learning",
    "Others",
  ],
  messages: [
    {
      id: "m1",
      name: "Maya Patel",
      email: "maya@example.com",
      subject: "Research collaboration",
      body: "Hi Brinto, I’m working on a small crop imaging study. Would you be interested in comparing approaches to dataset annotation?",
      date: "2026-11-18",
      read: false,
    },
    {
      id: "m2",
      name: "Daniel Kim",
      email: "daniel@example.com",
      subject: "Question about BookNook",
      body: "I saw the library project in your portfolio. I’d like to learn more about how you modeled borrowing and returns.",
      date: "2026-11-16",
      read: false,
    },
    {
      id: "m3",
      name: "Amina Rahman",
      email: "amina@example.com",
      subject: "Thanks for the article",
      body: "Your notes on model evaluation were helpful for a reading group I’m organizing. Thank you for sharing them.",
      date: "2026-11-14",
      read: true,
    },
  ],
  profile: {
    photo: portrait,
    name: profile.name,
    nickname: profile.nickname,
    title: profile.roles.join(" · "),
    location: profile.location,
    bio: "I build web applications and research practical uses of artificial intelligence.",
    research: researchAreas.join(", "),
    email: "",
  },
  settings: {
    title: "Brinto.dev",
    description: "Portfolio and research notes by Brinto.",
    seoTitle: "Brinto.dev | Software Engineer & AI Researcher",
    seoDescription:
      "Explore Brinto’s software projects, technical writing, and research.",
    language: "English",
    comments: "true",
    likes: "true",
    ...Object.fromEntries(homepageSections.map((section) => [section, "true"])),
  },
  documents: { resume: samplePdf("Resume"), cv: samplePdf("CV") },
  activities: [
    {
      id: "a1",
      title: "Received a new contact message",
      detail: "Research collaboration · Nov 18",
      section: "messages",
    },
    {
      id: "a2",
      title: "Published a new article",
      detail: "Introduction to Neuro-Symbolic AI · Nov 16",
      section: "blogs",
    },
    {
      id: "a3",
      title: "Updated a featured project",
      detail: "BookNook · Nov 15",
      section: "projects",
    },
    {
      id: "a4",
      title: "Added a certificate",
      detail: "Cloud Practitioner Essentials · Nov 13",
      section: "certifications",
    },
  ],
  unreadActivities: true,
}

export const analytics = [
  { label: "Jun", visitors: 420, views: 180, articles: 2, updates: 3 },
  { label: "Jul", visitors: 580, views: 290, articles: 3, updates: 2 },
  { label: "Aug", visitors: 530, views: 240, articles: 2, updates: 4 },
  { label: "Sep", visitors: 790, views: 370, articles: 4, updates: 3 },
  { label: "Oct", visitors: 730, views: 460, articles: 3, updates: 5 },
  { label: "Nov", visitors: 1040, views: 570, articles: 5, updates: 4 },
]
export const traffic = [
  { name: "Organic search", value: 46, fill: "#2859ec" },
  { name: "Direct", value: 28, fill: "#6f92ff" },
  { name: "Social", value: 17, fill: "#36b8d5" },
  { name: "Referral", value: 9, fill: "#c2d0ff" },
]
