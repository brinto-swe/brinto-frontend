export const profile = {
  name: "K M Mozaddedul Islam",
  nickname: "Brinto",
  roles: ["Software Engineer", "AI Researcher", "Full-Stack Developer"],
  available: true,
  location: "Yangzhou, China",
  openTo: "Junior / entry-level full-stack developer roles",
  email: undefined as string | undefined,
  resumeUrl: undefined as string | undefined,
  cvUrl: undefined as string | undefined,
}

export const portraits = [
  {
    file: "Confident Man in Charcoal Blazer.png",
    width: 1672,
    height: 941,
    center: "67.6%",
  },
  {
    file: "Professional Portrait Cutout.png",
    width: 1453,
    height: 1083,
    center: "57.6%",
  },
  {
    file: "Young Man in Charcoal Blazer and Turtleneck.png",
    width: 1671,
    height: 941,
    center: "67.4%",
  },
]

export const researchAreas = [
  "Artificial Intelligence",
  "Neuro-Symbolic AI",
  "Agricultural Computer Vision",
]

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "#contact" },
] as const

export const socialProfiles: { label: string; url?: string }[] = [
  { label: "GitHub" },
  { label: "LinkedIn" },
  { label: "YouTube" },
  { label: "Medium" },
  { label: "X" },
]

export const aboutFeatures = [
  {
    icon: "code",
    title: "Full-Stack Development",
    description:
      "Building end-to-end web applications with modern technologies.",
  },
  {
    icon: "stack",
    title: "Modern Tech Stack",
    description: "Working with React, Next.js, Django, Node.js, and databases.",
  },
  {
    icon: "ai",
    title: "AI & Problem Solving",
    description:
      "Exploring how AI can solve practical problems in real applications.",
  },
  {
    icon: "growth",
    title: "Career Goal",
    description:
      "Growing as a developer and contributing to products that solve useful problems.",
  },
] as const

export const education = [
  {
    degree: "Master of Engineering",
    institution: "Yangzhou University",
    current: true,
    description:
      "Research in artificial intelligence, neuro-symbolic AI, and agricultural computer vision.",
  },
  {
    degree: "Bachelor of Engineering in Software Engineering",
    institution: "Yangzhou University",
  },
]

export const skillGroups = [
  {
    title: "Frontend Development",
    icon: "screen",
    skills: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "Backend Development",
    icon: "code",
    skills: ["Python", "Django", "Node.js", "Express"],
  },
  {
    title: "Databases",
    icon: "database",
    skills: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "Tools & DevOps",
    icon: "workflow",
    skills: ["Git", "GitHub", "Docker", "Jenkins"],
  },
  {
    title: "AI / Machine Learning",
    icon: "ai",
    skills: ["PyTorch", "scikit-learn", "OpenCV", "Jupyter"],
  },
  {
    title: "Others",
    icon: "stack",
    skills: ["SQL", "REST APIs", "JWT", "Linux"],
  },
] as const

export const projectCategories = [
  "All Projects",
  "Web Development",
  "AI / ML",
  "Full-Stack",
  "Academic",
] as const
type ProjectCategory = Exclude<
  (typeof projectCategories)[number],
  "All Projects"
>

type Project = {
  name: string
  category: ProjectCategory
  additionalCategory?: ProjectCategory
  description: string
  stack: string[]
  thumbnail: {
    src: string
    width: number
    height: number
    crop?: { x: number; y: number; width: number; height: number }
  }
  githubUrl?: string
  demoUrl?: string
}

const demoPreview = { src: "/project-reference.png", width: 1672, height: 941 }

export const projects: Project[] = [
  {
    name: "BookNook",
    category: "Full-Stack",
    description:
      "A library management system for browsing, borrowing, and managing books with role-based access control.",
    stack: ["Next.js", "Node.js", "MongoDB", "JWT"],
    thumbnail: {
      ...demoPreview,
      crop: { x: 73, y: 367, width: 472, height: 218 },
    },
  },
  {
    name: "Smart Medical Image Diagnosis System with Explainable AI",
    category: "AI / ML",
    additionalCategory: "Academic",
    description:
      "An academic chest X-ray classification project exploring explainable AI for distinguishing pneumonia from normal images.",
    stack: ["Python", "PyTorch", "Django", "PostgreSQL"],
    thumbnail: {
      ...demoPreview,
      crop: { x: 600, y: 366, width: 476, height: 219 },
    },
  },
  {
    name: "Famenoor Store",
    category: "Web Development",
    description:
      "An e-commerce storefront concept for browsing imported products in a responsive shopping interface.",
    stack: ["React", "Django", "PostgreSQL", "Tailwind CSS"],
    thumbnail: {
      ...demoPreview,
      crop: { x: 1130, y: 367, width: 474, height: 218 },
    },
  },
]

type Certification = {
  title: string
  issuer: string
  logo: "aws" | "google" | "docker" | "meta" | "microsoft" | "django"
  issueDate?: { label: string; value: string }
  verificationUrl?: string
  verified: boolean
  demo: boolean
}

export const certifications: Certification[] = [
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    logo: "aws",
    verified: false,
    demo: true,
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google Career Certificates",
    logo: "google",
    verified: false,
    demo: true,
  },
  {
    title: "Docker Essentials",
    issuer: "Docker",
    logo: "docker",
    verified: false,
    demo: true,
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Meta",
    logo: "meta",
    verified: false,
    demo: true,
  },
  {
    title: "Azure Fundamentals",
    issuer: "Microsoft Learn",
    logo: "microsoft",
    verified: false,
    demo: true,
  },
  {
    title: "Django Web Development with Python",
    issuer: "Udemy",
    logo: "django",
    verified: false,
    demo: true,
  },
]

export const statistics = [
  { value: projects.length, label: "Featured projects" },
  { value: researchAreas.length, label: "Research areas" },
  { value: education.length, label: "Education entries" },
]
