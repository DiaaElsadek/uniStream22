"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  showText?: boolean;
}

export default function LanguageToggle({
  className = "",
  showText = true,
}: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-16 rounded-lg border border-border bg-secondary/50 animate-pulse",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // If language is 'ar', clicking switches to 'en' (shows 'EN')
  // If language is 'en', clicking switches to 'ar' (shows 'عربي')
  const nextLangLabel = language === "ar" ? "EN" : "عربي";
  const currentLangLabel = language === "ar" ? "عربي" : "EN";
  const ariaLabel =
    language === "ar"
      ? "Switch interface language to English"
      : "تغيير لغة الواجهة إلى العربية";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "group inline-flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 cursor-pointer select-none text-xs font-semibold",
        className
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Globe className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-300" aria-hidden="true" />
      {showText && (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
          {nextLangLabel}
        </span>
      )}
    </button>
  );
}
