import { Noto_Sans_Bengali } from "next/font/google"

export const blogBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: "variable",
  variable: "--font-blog-bengali",
  display: "swap",
  preload: false,
})
