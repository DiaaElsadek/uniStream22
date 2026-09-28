"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  SlidersHorizontal,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
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
  const [scheduleByDay, setScheduleByDay] = useState<Record<string, ScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Today index in WEEK_DAYS (JavaScript getDay: 0=Sun, 1=Mon, ..., 6=Sat)
  // Saturday is index 0 in WEEK_DAYS
  const todayIndex = (new Date().getDay() + 1) % 7;
  const todayName = WEEK_DAYS[todayIndex];

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
        )}&userToken=${encodeURIComponent(userToken ?? "")}`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.status !== 200) {
          throw new Error(data.message || "Failed to fetch timetable.");
        }

        if (isMounted) {
          setScheduleByDay(data.scheduleByDay || {});
          setIsAdmin(data.isAdmin || false);
          localStorage.setItem("cachedSchedule", JSON.stringify(data.scheduleByDay || {}));
          setError(null);
        }
      } catch (err: any) {
        console.error("Schedule fetch error:", err);
        if (isMounted) setError(err?.message || "Failed to load schedule");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <PageLayout
      isAdmin={isAdmin}
      title="Weekly Class Schedule"
      description="View your weekly lectures, lab locations, and timing based on your selected groups."
      action={
        <Link href="/selectschedule">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Edit Groups</span>
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading class schedule..." />
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto my-12 p-6 rounded-lg border border-destructive/20 bg-destructive/10 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" aria-hidden="true" />
          <h3 className="text-base font-semibold text-destructive">Schedule Unavailable</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : Object.keys(scheduleByDay).length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No schedule configured"
          description="You haven't selected your subject groups yet. Select your groups to view your timetable."
          action={
            <Link href="/selectschedule">
              <Button variant="primary">Select Groups Now</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {WEEK_DAYS.map((day) => {
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
                    "flex flex-col h-full border transition-colors",
                    isToday ? "border-primary/60 shadow-sm" : "border-border"
                  )}
                >
                  <CardHeader className="pb-3 border-b border-border bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">
                          {day}
                        </CardTitle>
                        {isToday && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-4 space-y-3">
                    {sortedLectures.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No lectures scheduled for this day
                      </div>
                    ) : (
                      sortedLectures.map((lec) => {
                        const subjectTitle =
                          SUBJECTS[lec.subjectId - 1] || `Course ${lec.subjectId}`;
                        const groupText =
                          lec.groupId === 0 ? "Global" : `Group ${lec.groupId}`;

                        return (
                          <div
                            key={lec.id}
                            className="rounded-md border border-border bg-card p-3.5 space-y-2 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-foreground leading-snug">
                                {subjectTitle}
                              </h4>
                              {lec.groupId !== undefined && (
                                <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground">
                                  <Users className="w-3 h-3" aria-hidden="true" />
                                  <span>{groupText}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                                <Clock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                <span>
                                  {lec.startTime ?? "—"} - {lec.endTime ?? "—"}
                                </span>
                              </span>

                              {lec.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                                  <span>{lec.location}</span>
                                </span>
                              )}
                            </div>

                            {lec.description && (
                              <p className="text-xs text-muted-foreground pt-1 border-t border-border/60">
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