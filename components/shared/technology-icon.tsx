import type { IconType } from "react-icons"
import {
  HiOutlineCircleStack,
  HiOutlineCodeBracket,
  HiOutlineGlobeAlt,
} from "react-icons/hi2"
import {
  SiDjango,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiJenkins,
  SiJsonwebtokens,
  SiJupyter,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiShadcnui,
  SiTailwindcss,
} from "react-icons/si"

const technologyIcons: Record<string, [IconType, string]> = {
  React: [SiReact, "#0085a0"],
  "Next.js": [SiNextdotjs, "#07142b"],
  "Tailwind CSS": [SiTailwindcss, "#0785a3"],
  "shadcn/ui": [SiShadcnui, "#07142b"],
  Python: [SiPython, "#286c9d"],
  Django: [SiDjango, "#086449"],
  "Node.js": [SiNodedotjs, "#33812b"],
  Express: [SiExpress, "#1f2937"],
  PostgreSQL: [SiPostgresql, "#336791"],
  MongoDB: [SiMongodb, "#218647"],
  MySQL: [SiMysql, "#076a90"],
  Git: [SiGit, "#d74729"],
  GitHub: [SiGithub, "#07142b"],
  Docker: [SiDocker, "#0877c7"],
  Jenkins: [SiJenkins, "#a4373b"],
  PyTorch: [SiPytorch, "#da4a26"],
  "scikit-learn": [SiScikitlearn, "#a75b00"],
  OpenCV: [SiOpencv, "#19774a"],
  Jupyter: [SiJupyter, "#bb530c"],
  SQL: [HiOutlineCircleStack, "#0867dd"],
  "REST APIs": [HiOutlineGlobeAlt, "#0867dd"],
  JWT: [SiJsonwebtokens, "#9938be"],
  Linux: [SiLinux, "#17243a"],
}

export function TechnologyIcon({ name }: { name: string }) {
  const [Icon, color] = technologyIcons[name] ?? [
    HiOutlineCodeBracket,
    "#0867dd",
  ]
  return <Icon aria-hidden="true" style={{ color }} />
}
