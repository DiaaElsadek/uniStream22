"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Users, Hash, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  subjectId: number;
  groupId: number;
  week: number;
  publish: boolean;
  priorty: string;
}

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب على البيانات",
  "إتصالات البيانات",
  "مشروع تخرج 1",
];

const priorityConfig = {
  high: {
    key: "home.highPriority",
    badge: "bg-destructive/10 text-destructive border-destructive/25 dark:bg-destructive/15",
    dot: "bg-destructive animate-pulse",
  },
  medium: {
    key: "home.mediumPriority",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  low: {
    key: "home.lowPriority",
    badge: "bg-primary/10 text-primary border-primary/25",
    dot: "bg-primary",
  },
  default: {
    key: "home.generalNotice",
    badge: "bg-secondary text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const { t, isRTL } = useLanguage();
  const priorityKey = (item.priorty?.toLowerCase() as keyof typeof priorityConfig) || "default";
  const priority = priorityConfig[priorityKey] || priorityConfig.default;
  const subjectName = SUBJECTS[item.subjectId - 1] || t("home.globalNotice");
  const groupName = item.groupId === 0 ? t("home.globalNotice") : `${t("home.groupPrefix")} ${item.groupId}`;
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Card hoverable className="group/card flex flex-col h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <CardHeader className="pb-3 space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs",
              priority.badge
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} aria-hidden="true" />
            {t(priority.key)}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-md bg-secondary/80 border border-border/60">
            <Hash className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
            {t("home.week")} {item.week}
          </span>
        </div>

        <CardTitle className="text-base sm:text-lg font-bold leading-snug line-clamp-2 text-foreground group-hover/card:text-primary transition-colors duration-150">
          {item.title || "Untitled Announcement"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4" dir="auto">
          {item.content || "No detailed description provided."}
        </p>

        {/* Metadata Grid */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-muted-foreground pt-3 border-t border-border/70">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/60 text-foreground font-medium">
            <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{subjectName}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/60 text-muted-foreground font-medium">
            <Users className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{groupName}</span>
          </span>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 ms-auto text-[11px]">
              <Calendar className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/new/${item.id}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs group/btn"
        >
          <span>{t("home.readMore")}</span>
          <ArrowIcon className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
