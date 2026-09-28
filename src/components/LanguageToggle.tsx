"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  showText?: boolean;
}

export default function LanguageToggle({
  className = "",
  showText = true,
}: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-md border border-border bg-secondary/50 animate-pulse",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // If language is 'ar', clicking switches to 'en' (and shows 'EN')
  // If language is 'en', clicking switches to 'ar' (and shows 'عربي')
  const nextLangLabel = language === "ar" ? "EN" : "عربي";
  const ariaLabel =
    language === "ar"
      ? "Switch interface language to English"
      : "تغيير لغة الواجهة إلى العربية";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-md border border-border bg-background text-foreground hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none text-xs font-semibold",
        className
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Languages className="h-4 w-4 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
      {showText && <span className="font-bold tracking-wide">{nextLangLabel}</span>}
    </button>
  );
}
