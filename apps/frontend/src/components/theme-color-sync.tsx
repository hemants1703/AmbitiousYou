"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

const themeColors = {
  light: "#ffffff",
  dark: "#09090b",
}

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

    if (!themeColorMeta) {
      return
    }

    themeColorMeta.setAttribute("content", resolvedTheme === "dark" ? themeColors.dark : themeColors.light)
  }, [resolvedTheme])

  return null
}