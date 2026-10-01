"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export interface WeekNavProps {
  weeks: (number | string)[];
  activeWeek: number | null;
  onSelectWeek: (week: number | null) => void;
  className?: string;
}

export default function WeekNav({
  weeks,
  activeWeek,
  onSelectWeek,
  className,
}: WeekNavProps) {
  const { t } = useLanguage();

  if (weeks.length <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar justify-center sm:justify-start flex-wrap",
        className
      )}
      role="tablist"
      aria-label="Filter news by week"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeWeek === null}
        onClick={() => onSelectWeek(null)}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer select-none",
          activeWeek === null
            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
            : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border-strong border border-border shadow-2xs"
        )}
      >
        {t("common.all")}
      </button>

      {weeks.map((week) => {
        const weekNum = typeof week === "number" ? week : Number(week);
        const isSelected = activeWeek === weekNum;

        return (
          <button
            key={String(week)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectWeek(weekNum)}
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer select-none",
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border-strong border border-border shadow-2xs"
            )}
          >
            {t("home.week")} {week}
          </button>
        );
      })}
    </div>
  );
}
