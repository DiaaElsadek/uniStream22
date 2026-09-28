"use client";

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search for news, subjects, or groups...",
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut (Ctrl+K / Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative w-full max-w-xl mx-auto group", className)}>
      <Search
        className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search announcements"
        className="w-full rounded-xl border border-border bg-card text-foreground ps-10 pe-16 py-2.5 text-sm placeholder:text-muted-foreground shadow-2xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent hover:border-border-strong"
      />
      <div className="absolute end-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-secondary/80 border border-border rounded shadow-2xs pointer-events-none">
            <span>⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  );
}
