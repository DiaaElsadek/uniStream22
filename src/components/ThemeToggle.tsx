"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  onThemeChange?: (isDark: boolean) => void;
  className?: string;
}

export default function ThemeToggle({ onThemeChange, className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    if (onThemeChange) {
      onThemeChange(nextTheme === "dark");
    }
  };

  if (!mounted) {
    return (
      <div 
        className={cn("w-9 h-9 rounded-lg border border-border bg-secondary/50 animate-pulse", className)}
        aria-hidden="true" 
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:border-border-strong transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
      )}
    </button>
  );
}