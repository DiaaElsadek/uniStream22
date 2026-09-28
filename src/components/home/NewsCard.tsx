"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Users, Hash, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    variant: "destructive" as const,
    dotColor: "bg-destructive animate-pulse",
  },
  medium: {
    key: "home.mediumPriority",
    variant: "success" as const,
    dotColor: "bg-emerald-500",
  },
  low: {
    key: "home.lowPriority",
    variant: "accent" as const,
    dotColor: "bg-primary",
  },
  default: {
    key: "home.generalNotice",
    variant: "secondary" as const,
    dotColor: "bg-muted-foreground",
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

  const subjectInitial = subjectName.charAt(0);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Card hoverable className="group/card flex flex-col h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md bg-card/95 backdrop-blur-xs">
      <CardHeader className="pb-3 space-y-3">
        {/* Top Badges using shadcn Badge */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={priority.variant}
            dotColor={priority.dotColor}
            size="sm"
            className="font-semibold shadow-2xs"
          >
            {t(priority.key)}
          </Badge>

          <Badge variant="outline" size="sm" className="gap-1 font-mono text-[11px] text-muted-foreground bg-secondary/40">
            <Hash className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
            {t("home.week")} {item.week}
          </Badge>
        </div>

        {/* Title with Subject Avatar Initial */}
        <div className="flex items-start gap-2.5">
          <Avatar className="h-8 w-8 shrink-0 mt-0.5 border-primary/20 bg-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {subjectInitial}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base sm:text-lg font-bold leading-snug line-clamp-2 text-foreground group-hover/card:text-primary transition-colors duration-150">
            {item.title || "Untitled Announcement"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4" dir="auto">
          {item.content || "No detailed description provided."}
        </p>

        {/* Metadata Grid */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs text-muted-foreground pt-3 border-t border-border/70">
          <Badge variant="secondary" size="sm" className="gap-1 font-medium bg-secondary/70">
            <BookOpen className="w-3 h-3 text-primary" aria-hidden="true" />
            <span className="truncate max-w-[130px] sm:max-w-[170px]">{subjectName}</span>
          </Badge>

          <Badge variant="outline" size="sm" className="gap-1 font-medium bg-background/50">
            <Users className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
            <span>{groupName}</span>
          </Badge>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 ms-auto text-[11px] text-muted-foreground font-medium">
              <Calendar className="w-3 h-3 opacity-70" aria-hidden="true" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/new/${item.id}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs group/btn"
        >
          <span>{t("home.readMore")}</span>
          <ArrowIcon className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
