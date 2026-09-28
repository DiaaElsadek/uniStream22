"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/home/SearchInput";
import NewsCard, { NewsItem } from "@/components/home/NewsCard";
import WeekNav from "@/components/home/WeekNav";
import { Newspaper, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب على البيانات",
  "إتصالات البيانات",
  "مشروع تخرج 1",
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`/api/home?userToken=${token}`);
        const data = await res.json();

        if (!data.status) {
          router.replace("/login");
          return;
        }

        if (!isMounted) return;

        setIsAdmin(data.user?.Role === "admin");

        const allNews: NewsItem[] = Array.isArray(data.news)
          ? data.news
              .filter((n: NewsItem) => n && n.week !== undefined && n.week !== null)
              .sort((a: NewsItem, b: NewsItem) => b.week - a.week)
          : [];

        setNews(allNews);
        localStorage.setItem("cachedNews", JSON.stringify(allNews));
      } catch (err) {
        console.error("Failed to fetch home announcements:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Filter published news by search query and optional week filter
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (item.publish !== true) return false;

      if (selectedWeek !== null && item.week !== selectedWeek) {
        return false;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const subjectName = (SUBJECTS[item.subjectId - 1] || "Global").toLowerCase();
      const groupStr = item.groupId === 0 ? "global" : item.groupId?.toString() || "";
      const titleStr = (item.title || "").toLowerCase();
      const contentStr = (item.content || "").toLowerCase();

      return (
        subjectName.includes(query) ||
        groupStr.includes(query) ||
        titleStr.includes(query) ||
        contentStr.includes(query)
      );
    });
  }, [news, searchQuery, selectedWeek]);

  // Group published news by week
  const groupedNews = useMemo(() => {
    return filteredNews.reduce((acc, item) => {
      const week = item.week ?? "General";
      if (!acc[week]) acc[week] = [];
      acc[week].push(item);
      return acc;
    }, {} as Record<string | number, NewsItem[]>);
  }, [filteredNews]);

  // Sorted unique weeks
  const availableWeeks = useMemo(() => {
    const publishedOnly = news.filter((n) => n.publish === true);
    const weeksSet = new Set(publishedOnly.map((n) => n.week).filter((w) => w !== undefined));
    return Array.from(weeksSet).sort((a, b) => Number(b) - Number(a));
  }, [news]);

  const sortedGroupedWeekKeys = useMemo(() => {
    return Object.keys(groupedNews)
      .map((k) => (isNaN(Number(k)) ? k : Number(k)))
      .sort((a, b) =>
        typeof a === "number" && typeof b === "number"
          ? b - a
          : String(b).localeCompare(String(a))
      );
  }, [groupedNews]);

  return (
    <PageLayout
      isAdmin={isAdmin}
      title={t("home.title")}
      description={t("home.subtitle")}
    >
      {/* Search & Week Filter Controls */}
      <div className="space-y-4 mb-8">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("home.searchPlaceholder")}
        />

        {availableWeeks.length > 0 && (
          <WeekNav
            weeks={availableWeeks}
            activeWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
          />
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" label={t("home.loadingFeed")} />
        </div>
      ) : sortedGroupedWeekKeys.length === 0 ? (
        searchQuery || selectedWeek !== null ? (
          <EmptyState
            icon={SearchX}
            title={t("home.noMatchingTitle")}
            description={t("home.noMatchingDesc")}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedWeek(null);
                }}
              >
                {t("home.clearFilters")}
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Newspaper}
            title={t("home.noAnnouncementsTitle")}
            description={t("home.noAnnouncementsDesc")}
          />
        )
      ) : (
        <div className="space-y-10">
          {sortedGroupedWeekKeys.map((weekKey) => {
            const items = groupedNews[weekKey];
            if (!items || items.length === 0) return null;

            return (
              <section key={String(weekKey)} className="space-y-4">
                {/* Clean Week Heading Divider */}
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      {t("home.week")} {weekKey}
                    </h2>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                      {items.length}{" "}
                      {items.length === 1
                        ? t("home.announcementSingular")
                        : t("home.announcementPlural")}
                    </span>
                  </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}