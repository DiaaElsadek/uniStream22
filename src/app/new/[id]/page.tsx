"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import Toast from "@/components/Toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Calendar,
  BookOpen,
  Users,
  Hash,
  ExternalLink,
  FileQuestion,
  Check,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

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

export default function NewsDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { t, isRTL } = useLanguage();

  const [newsItem, setNewsItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [extractedLinks, setExtractedLinks] = useState<{ url: string; displayText: string }[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const extractLinksFromContent = (content: string) => {
    if (!content) return [];
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const links: { url: string; displayText: string }[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const rawUrl = match[0];
      const fullUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
      try {
        const domain = new URL(fullUrl).hostname.replace("www.", "");
        links.push({ url: fullUrl, displayText: domain });
      } catch {
        links.push({ url: fullUrl, displayText: rawUrl });
      }
    }
    return links;
  };

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");

    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/new?id=${id}`, { method: "GET" });
        const data = await res.json();

        if (isMounted) {
          if (data.status && Array.isArray(data.data) && data.data.length > 0) {
            const item = data.data[0];
            setNewsItem(item);
            if (item.content) {
              setExtractedLinks(extractLinksFromContent(item.content));
            }
          } else {
            setNewsItem(null);
          }
        }
      } catch (err) {
        console.error("Error fetching news details:", err);
        if (isMounted) setNewsItem(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && newsItem) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.content?.substring(0, 100) + "...",
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const priorityKey = (newsItem?.priorty?.toLowerCase() as keyof typeof priorityConfig) || "default";
  const priority = priorityConfig[priorityKey] || priorityConfig.default;
  const subjectName = newsItem ? SUBJECTS[newsItem.subjectId - 1] || t("home.globalNotice") : "";
  const groupText = newsItem ? (newsItem.groupId === 0 ? t("home.globalNotice") : `${t("home.groupPrefix")} ${newsItem.groupId}`) : "";
  const formattedDate = newsItem?.createdAt
    ? new Date(newsItem.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <PageLayout isAdmin={isAdmin} maxWidth="narrow">
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        type="success"
        title={t("newsDetail.linkCopiedTitle")}
        message={t("newsDetail.linkCopiedMsg")}
      />

      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
        <Link href="/home">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <BackArrow className="h-4 w-4" aria-hidden="true" />
            <span>{t("newsDetail.backToAnnouncements")}</span>
          </Button>
        </Link>

        {newsItem && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
            aria-label="Share this announcement"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span>{copied ? t("newsDetail.copied") : t("newsDetail.share")}</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" label={t("common.loading")} />
        </div>
      ) : !newsItem ? (
        <EmptyState
          icon={FileQuestion}
          title={t("newsDetail.notFoundTitle")}
          description={t("newsDetail.notFoundDesc")}
          action={
            <Link href="/home">
              <Button variant="primary">{t("newsDetail.returnToFeed")}</Button>
            </Link>
          }
        />
      ) : (
        <article className="space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  priority.badge
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} aria-hidden="true" />
                {t(priority.key)}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2.5 py-0.5 rounded-md bg-secondary border border-border">
                <Hash className="w-3 h-3" aria-hidden="true" />
                {t("home.week")} {newsItem.week}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2.5 py-0.5 rounded-md bg-secondary border border-border">
                <Users className="w-3 h-3" aria-hidden="true" />
                {groupText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {newsItem.title || "Untitled Announcement"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="font-medium text-foreground">{subjectName}</span>
              </span>

              {formattedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <span>{t("newsDetail.publishedOn")} {formattedDate}</span>
                </span>
              )}
            </div>
          </div>

          {/* Article Body */}
          <Card className="border-border">
            <CardContent className="p-6 sm:p-8">
              <div
                dir="auto"
                className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed whitespace-pre-line text-foreground"
              >
                {newsItem.content}
              </div>
            </CardContent>
          </Card>

          {/* Extracted External Resources */}
          {extractedLinks.length > 0 && (
            <Card className="border-border bg-secondary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>{t("newsDetail.attachedLinks")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {extractedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors text-sm text-foreground group"
                  >
                    <span className="truncate pr-4 font-medium text-primary group-hover:underline underline-offset-4">
                      {link.url}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" aria-hidden="true" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </article>
      )}
    </PageLayout>
  );
}