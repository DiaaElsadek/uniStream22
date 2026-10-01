"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import EmptyState from "@/components/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  MapPin,
  Users,
  SlidersHorizontal,
  CalendarDays,
  AlertCircle,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type ScheduleItem = {
  id: number;
  subjectId: number;
  groupId?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  description?: string | null;
  day?: string | null;
};

const WEEK_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب على البيانات",
  "إتصالات البيانات",
  "مشروع تخرج 1",
];

const START_TIMES = [
  "9:00",
  "9:45",
  "10:40",
  "11:25",
  "12:20",
  "1:05",
  "2:00",
  "2:45",
];

export default function SchedulePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [scheduleByDay, setScheduleByDay] = useState<Record<string, ScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Today index in WEEK_DAYS (JavaScript getDay: 0=Sun, 1=Mon, ..., 6=Sat)
  const todayIndex = (new Date().getDay() + 1) % 7;
  const todayName = WEEK_DAYS[todayIndex];
  const [selectedDayTab, setSelectedDayTab] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      try {
        const academicId = localStorage.getItem("academicId");
        const userToken = localStorage.getItem("userToken");

        if (!academicId) {
          router.replace("/login");
          return;
        }

        const cached = localStorage.getItem("cachedSchedule");
        if (cached && isMounted) {
          try {
            setScheduleByDay(JSON.parse(cached));
            setLoading(false);
          } catch {
            // Invalid cache
          }
        }

        const url = `/api/schedule?academicId=${encodeURIComponent(
          academicId
        )}&userToken=${encodeURIComponent(userToken || "")}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!isMounted) return;

        if (data.status) {
          setScheduleByDay(data.scheduleByDay || {});
          setIsAdmin(data.role === "admin");
          localStorage.setItem(
            "cachedSchedule",
            JSON.stringify(data.scheduleByDay || {})
          );
        } else {
          setError(data.message || "Failed to load your timetable");
        }
      } catch (err) {
        console.error("Fetch schedule error:", err);
        if (isMounted) setError("Failed to connect to the timetable server");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Days to display based on selected tab
  const displayedDays = selectedDayTab === "all" ? WEEK_DAYS : [selectedDayTab];

  return (
    <PageLayout
      isAdmin={isAdmin}
      title={t("schedule.title")}
      description={t("schedule.subtitle")}
      action={
        <Link href="/selectschedule">
          <Button variant="outline" size="sm" className="gap-2 shadow-2xs">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>{t("schedule.editGroups")}</span>
          </Button>
        </Link>
      }
    >
      {/* Day Filter Tabs */}
      <div className="mb-6 overflow-x-auto pb-1">
        <Tabs value={selectedDayTab} onValueChange={setSelectedDayTab}>
          <TabsList className="inline-flex h-auto p-1 gap-1">
            <TabsTrigger value="all" className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{t("home.allNews") || "All Days"}</span>
            </TabsTrigger>
            {WEEK_DAYS.map((day) => {
              const isToday = day === todayName;
              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm relative"
                >
                  <span>{t(`schedule.days.${day}`)}</span>
                  {isToday && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/80 p-5 space-y-4 bg-card/60">
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto my-12 p-6 rounded-2xl border border-destructive/20 bg-destructive/10 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" aria-hidden="true" />
          <h3 className="text-base font-semibold text-destructive">{t("schedule.unavailableTitle")}</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            {t("common.retry")}
          </Button>
        </div>
      ) : Object.keys(scheduleByDay).length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={t("schedule.noScheduleTitle")}
          description={t("schedule.noScheduleDesc")}
          action={
            <Link href="/selectschedule">
              <Button variant="primary">{t("schedule.selectGroupsNow")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Days Grid */}
          <div className={cn(
            "grid gap-6",
            selectedDayTab === "all"
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 max-w-2xl mx-auto"
          )}>
            {displayedDays.map((day) => {
              const lectures = scheduleByDay[day] || [];
              const isToday = day === todayName;

              const sortedLectures = [...lectures].sort((a, b) => {
                const indexA = START_TIMES.indexOf(a.startTime ?? "");
                const indexB = START_TIMES.indexOf(b.startTime ?? "");
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
              });

              return (
                <Card
                  key={day}
                  className={cn(
                    "flex flex-col h-full rounded-xl border transition-colors duration-150 overflow-hidden",
                    isToday
                      ? "border-primary/60 bg-card shadow-xs"
                      : "border-border bg-card shadow-2xs hover:border-border-strong"
                  )}
                >
                  <CardHeader className={cn(
                    "py-3 px-4 border-b border-border/80",
                    isToday ? "bg-primary/5" : "bg-secondary/40"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold text-foreground">
                          {t(`schedule.days.${day}`)}
                        </CardTitle>
                        {isToday && (
                          <Badge variant="default" size="sm" className="gap-1 font-medium">
                            <Sparkles className="w-3 h-3" />
                            <span>{t("schedule.todayBadge")}</span>
                          </Badge>
                        )}
                      </div>
                      <Badge variant="secondary" size="sm" className="font-medium">
                        {lectures.length}{" "}
                        {lectures.length === 1
                          ? t("schedule.lectureSingular")
                          : t("schedule.lecturePlural")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-3.5 space-y-2.5">
                    {sortedLectures.length === 0 ? (
                      <div className="py-10 text-center text-xs text-muted-foreground">
                        {t("schedule.noLectures")}
                      </div>
                    ) : (
                      sortedLectures.map((lec) => {
                        const subjectTitle =
                          SUBJECTS[lec.subjectId - 1] || `Course ${lec.subjectId}`;
                        const groupText =
                          lec.groupId === 0 ? t("schedule.global") : `${t("schedule.groupPrefix")} ${lec.groupId}`;

                        return (
                          <div
                            key={lec.id}
                            className="rounded-lg border border-border/70 border-s-[3px] border-s-primary bg-secondary/20 p-3 space-y-2 transition-colors duration-150 hover:bg-secondary/40 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                                {subjectTitle}
                              </h4>

                              {lec.groupId !== undefined && (
                                <Badge variant="secondary" size="sm" className="gap-1 shrink-0 font-medium">
                                  <Users className="w-3 h-3" aria-hidden="true" />
                                  <span>{groupText}</span>
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-muted-foreground">
                              <Badge variant="accent" size="sm" className="gap-1 font-medium font-mono text-[11px]">
                                <Clock className="w-3 h-3 text-primary" aria-hidden="true" />
                                <span>
                                  {lec.startTime ?? "—"} - {lec.endTime ?? "—"}
                                </span>
                              </Badge>

                              {lec.location && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <MapPin className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                                  <span>{lec.location}</span>
                                </span>
                              )}
                            </div>

                            {lec.description && (
                              <p className="text-xs text-muted-foreground pt-1.5 border-t border-border/50 leading-relaxed" dir="auto">
                                {lec.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </PageLayout>
  );
}