"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import arTranslations from "@/locales/ar.json";
import enTranslations from "@/locales/en.json";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, any> = {
  ar: arTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Arabic for HTI students, with immediate persistence sync
  const [language, setLanguageState] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored =
        (localStorage.getItem("unistream_language") as Language) ||
        (localStorage.getItem("language") as Language);
      if (stored === "ar" || stored === "en") {
        setLanguageState(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  const direction: Direction = useMemo(() => {
    return language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const isRTL = direction === "rtl";

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem("unistream_language", language);
      localStorage.setItem("language", language);
    } catch {
      // Ignore localStorage errors
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = direction;
      document.body.dir = direction;
    }
  }, [language, direction, mounted]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let currentObj: any = translations[language];

      for (const k of keys) {
        if (currentObj && typeof currentObj === "object" && k in currentObj) {
          currentObj = currentObj[k];
        } else {
          // Fallback to opposite language if key is missing
          const fallbackObj: any = translations[language === "ar" ? "en" : "ar"];
          let fb: any = fallbackObj;
          for (const fbk of keys) {
            if (fb && typeof fb === "object" && fbk in fb) {
              fb = fb[fbk];
            } else {
              fb = undefined;
              break;
            }
          }
          currentObj = fb !== undefined ? fb : key;
          break;
        }
      }

      if (typeof currentObj !== "string") {
        return key;
      }

      let result = currentObj;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
        });
      }

      return result;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      direction,
      isRTL,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, direction, isRTL, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
