export type ShareFeedback = { kind: "copied" } | { kind: "manual"; url: string }

type ShareBrowser = {
  share?: Navigator["share"]
  clipboard?: Pick<Clipboard, "writeText">
}

export async function copyArticleLink(
  browser: ShareBrowser,
  url: string
): Promise<ShareFeedback> {
  try {
    if (browser.clipboard) {
      await browser.clipboard.writeText(url)
      return { kind: "copied" }
    }
  } catch {
    // Keep the link available when the browser blocks automatic copying.
  }
  return { kind: "manual", url }
}

export async function shareArticle(
  browser: ShareBrowser,
  title: string,
  url: string
) {
  if (browser.share) {
    try {
      await browser.share({ title, url })
      return null
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return null
    }
  }
  return copyArticleLink(browser, url)
}
