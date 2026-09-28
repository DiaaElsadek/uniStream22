"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Users, Hash } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export type DashboardNewsItem = {
  id: number;
  title: string;
  content: string;
  subjectId: number;
  groupId: number;
  week: number;
  priorty: string;
  publish: boolean;
  createdBy?: string;
  createdAt?: string;
};

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب على البيانات",
  "اتصالات البيانات",
  "مشروع تخرج 1",
];

interface NewsTableProps {
  items: DashboardNewsItem[];
  onEdit: (item: DashboardNewsItem) => void;
  onDelete: (id: number) => void;
}

export default function NewsTable({ items, onEdit, onDelete }: NewsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs text-muted-foreground uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">{t("dashboard.tableTitle")}</th>
              <th className="py-3 px-4">{t("dashboard.tableCourse")}</th>
              <th className="py-3 px-4">{t("dashboard.tableWeek")}</th>
              <th className="py-3 px-4">{t("dashboard.tablePriority")}</th>
              <th className="py-3 px-4">{t("dashboard.tableStatus")}</th>
              <th className="py-3 px-4 text-end">{t("dashboard.tableActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => {
              const subjectTitle = SUBJECTS[item.subjectId - 1] || t("home.globalNotice");
              const groupText = item.groupId === 0 ? t("home.globalNotice") : `${t("home.groupPrefix")} ${item.groupId}`;

              return (
                <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <div className="font-semibold text-foreground truncate">
                      {item.title || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" dir="auto">
                      {item.content}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-xs text-foreground font-medium">
                    {subjectTitle}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                      <span>{groupText}</span>
                    </span>
                    <span className="mx-1.5 text-border">•</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Hash className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                      <span>{t("home.week")} {item.week}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase",
                        item.priorty === "high"
                          ? "bg-destructive/10 text-destructive"
                          : item.priorty === "low"
                          ? "bg-primary/10 text-primary"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {item.priorty === "high"
                        ? t("home.highPriority")
                        : item.priorty === "low"
                        ? t("home.lowPriority")
                        : t("home.mediumPriority")}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium",
                        item.publish
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {item.publish ? t("dashboard.publishedBadge") : t("dashboard.draftBadge")}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-end whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        title={t("dashboard.editTooltip")}
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        title={t("dashboard.deleteTooltip")}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
