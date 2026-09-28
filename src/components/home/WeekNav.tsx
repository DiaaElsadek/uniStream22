"use client";

import React from "react";
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
  if (weeks.length <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar justify-center sm:justify-start flex-wrap",
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
          "inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer",
          activeWeek === null
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
        )}
      >
        All Weeks
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
              "inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
            )}
          >
            Week {week}
          </button>
        );
      })}
    </div>
  );
}
