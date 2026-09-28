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
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  medium: {
    key: "home.mediumPriority",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  low: {
    key: "home.lowPriority",
    badge: "bg-primary/10 text-primary border-primary/20",
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
    <Card hoverable className="flex flex-col h-full overflow-hidden transition-all duration-150">
      <CardHeader className="pb-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
              priority.badge
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} aria-hidden="true" />
            {t(priority.key)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="w-3 h-3" aria-hidden="true" />
            {t("home.week")} {item.week}
          </span>
        </div>

        <CardTitle className="text-lg font-semibold leading-snug line-clamp-2 text-foreground">
          {item.title || "Untitled Announcement"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4" dir="auto">
          {item.content || "No detailed description provided."}
        </p>

        {/* Metadata Grid */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-muted-foreground pt-2 border-t border-border">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="font-medium text-foreground">{subjectName}</span>
          </span>

          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{groupName}</span>
          </span>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 ms-auto">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/new/${item.id}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>{t("home.readMore")}</span>
          <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
