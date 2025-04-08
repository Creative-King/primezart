"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = {
  code: string
  name: string
  flag: string
}

export const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
]

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  languages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguageCode = localStorage.getItem("languagePreference")
      if (savedLanguageCode) {
        const savedLanguage = languages.find((lang) => lang.code === savedLanguageCode)
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage)
        }
      }
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    if (typeof window !== "undefined") {
      localStorage.setItem("languagePreference", language.code)
      // In a real app, you might also set a cookie or update the HTML lang attribute
      document.documentElement.lang = language.code
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages }}>{children}</LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

