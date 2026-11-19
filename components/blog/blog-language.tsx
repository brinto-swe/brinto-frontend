import { feedCopy } from "@/data/blog/copy"
import type { Language } from "@/data/blog/schema"

export const blogLanguages = ["en", "bn"] as const

export function BlogLanguage({
  language,
  onChange,
}: {
  language: Language
  onChange: (language: Language) => void
}) {
  return (
    <div
      className="blog-language"
      role="group"
      aria-label={feedCopy[language].languages}
    >
      {blogLanguages.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={language === option}
          onClick={() => onChange(option)}
        >
          {option === "en" ? "EN" : "বাংলা"}
        </button>
      ))}
    </div>
  )
}
