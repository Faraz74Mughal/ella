import { createContext, useContext, useEffect, useState, type FC } from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "platform-ui-theme",
  ...props
}: ThemeProviderProps) {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

  const resolveTheme = (theme: Theme): ResolvedTheme =>
    theme === "system" ? getSystemTheme() : theme

  const getStoredTheme = () => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    return storedTheme || defaultTheme
  }

  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredTheme())
  )

  useEffect(() => {
    const root = window.document.documentElement
    const applyTheme = (nextTheme: ResolvedTheme) => {
      root.classList.remove("light", "dark")
      root.classList.add(nextTheme)
      setResolvedTheme(nextTheme)
    }

    if (theme === "system") {
      const systemTheme = resolveTheme(theme)
      applyTheme(systemTheme)

      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (event: MediaQueryListEvent) => {
        applyTheme(event.matches ? "dark" : "light")
      }

      media.addEventListener("change", handleChange)
      return () => media.removeEventListener("change", handleChange)
    }

    applyTheme(theme)
  }, [theme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
      setResolvedTheme(resolveTheme(theme))
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}