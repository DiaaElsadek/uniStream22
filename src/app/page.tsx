"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Calendar,
  Newspaper,
  StickyNote,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  Sparkles,
  Layers,
  MapPin,
  Hash,
  ChevronRight,
  ChevronLeft,
  LogIn,
  UserPlus,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const COURSES = [
    {
      code: "CS401",
      name: t("landing.course1Name"),
      description: t("landing.course1Desc"),
    },
    {
      code: "CS402",
      name: t("landing.course2Name"),
      description: t("landing.course2Desc"),
    },
    {
      code: "CS403",
      name: t("landing.course3Name"),
      description: t("landing.course3Desc"),
    },
    {
      code: "CS404",
      name: t("landing.course4Name"),
      description: t("landing.course4Desc"),
    },
    {
      code: "CS405",
      name: t("landing.course5Name"),
      description: t("landing.course5Desc"),
    },
  ];

  const FEATURES = [
    {
      icon: Newspaper,
      title: t("landing.feat1Title"),
      description: t("landing.feat1Desc"),
      badge: t("landing.feat1Badge"),
      accent: "from-blue-500/20 to-indigo-500/5",
    },
    {
      icon: Calendar,
      title: t("landing.feat2Title"),
      description: t("landing.feat2Desc"),
      badge: t("landing.feat2Badge"),
      accent: "from-emerald-500/20 to-teal-500/5",
    },
    {
      icon: Users,
      title: t("landing.feat3Title"),
      description: t("landing.feat3Desc"),
      badge: t("landing.feat3Badge"),
      accent: "from-purple-500/20 to-pink-500/5",
    },
    {
      icon: StickyNote,
      title: t("landing.feat4Title"),
      description: t("landing.feat4Desc"),
      badge: t("landing.feat4Badge"),
      accent: "from-amber-500/20 to-orange-500/5",
    },
    {
      icon: Smartphone,
      title: t("landing.feat5Title"),
      description: t("landing.feat5Desc"),
      badge: t("landing.feat5Badge"),
      accent: "from-sky-500/20 to-blue-500/5",
    },
    {
      icon: ShieldCheck,
      title: t("landing.feat6Title"),
      description: t("landing.feat6Desc"),
      badge: t("landing.feat6Badge"),
      accent: "from-slate-500/20 to-zinc-500/5",
    },
  ];

  const STEPS = [
    {
      step: t("landing.step1Number"),
      title: t("landing.step1Title"),
      description: t("landing.step1Desc"),
    },
    {
      step: t("landing.step2Number"),
      title: t("landing.step2Title"),
      description: t("landing.step2Desc"),
    },
    {
      step: t("landing.step3Number"),
      title: t("landing.step3Title"),
      description: t("landing.step3Desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold tracking-tight">{t("common.appName")}</span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {t("common.appSubtitle")}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              {t("landing.navFeatures")}
            </a>
            <a href="#preview" className="hover:text-foreground transition-colors">
              {t("landing.navPreview")}
            </a>
            <a href="#courses" className="hover:text-foreground transition-colors">
              {t("landing.navCurriculum")}
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              {t("landing.navWorkflow")}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {isLoggedIn ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/home")}
                className="gap-1.5"
              >
                <span>{t("landing.goToDashboard")}</span>
                <ArrowIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5">
                    <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t("landing.signIn")}</span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t("landing.register")}</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Ambient Glow */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18),transparent_70%)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              {/* Academic Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-background/80 border border-primary/25 text-foreground backdrop-blur-md shadow-xs animate-float-gentle">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>{t("landing.heroBadge")}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.18]">
                {t("landing.heroTitle")}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("landing.heroSubtitle")}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {isLoggedIn ? (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => router.push("/home")}
                    className="w-full sm:w-auto gap-2 px-6 text-base"
                  >
                    <span>{t("landing.launchFeed")}</span>
                    <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <>
                    <Link href="/signup" className="w-full sm:w-auto">
                      <Button size="lg" variant="primary" className="w-full gap-2 px-6 text-base">
                        <span>{t("landing.getStarted")}</span>
                        <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full gap-2 px-6 text-base">
                        <span>{t("landing.signInAccount")}</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>{t("landing.trustId")}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>{t("landing.trustNoAds")}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>{t("landing.trustPwa")}</span>
                </span>
              </div>
            </div>

            {/* Live-Feel UI Preview Mockup */}
            <div id="preview" className="mt-12 sm:mt-16 max-w-5xl mx-auto">
              <div className="rounded-2xl border border-border/80 bg-card p-2 sm:p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-border/80 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 dark:bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-[11px] font-mono text-muted-foreground truncate max-w-xs sm:max-w-md">
                    <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span>unistream22.vercel.app/home</span>
                  </div>
                  <div className="text-[11px] font-semibold text-foreground">
                    {t("landing.previewSemester")}
                  </div>
                </div>

                {/* Mock Content Layout */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/50 rounded-b-xl">
                  {/* Left Column: Sample Announcement Card */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                      <span className="font-semibold text-foreground uppercase tracking-wider">
                        {t("landing.previewLatestAnnounce")}
                      </span>
                      <span className="text-primary font-medium">
                        {t("landing.previewJustPublished")}
                      </span>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                          {t("landing.previewHighPriority")}
                        </span>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Hash className="w-3 h-3" /> {t("landing.previewWeek")}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-foreground">
                        {t("landing.previewAnnounceTitle")}
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {t("landing.previewAnnounceContent")}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <BookOpen className="w-3.5 h-3.5 text-primary" /> {t("landing.previewCourseName")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {t("landing.previewGroupName")}
                        </span>
                        <span className="inline-flex items-center gap-1 ms-auto">
                          <Calendar className="w-3.5 h-3.5" /> Oct 24
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Schedule & Sticky Note Snippet */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        {t("landing.previewTodayLecture")}
                      </span>
                      <div className="rounded-xl border border-primary/40 bg-card p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {t("landing.previewCloudComputing")}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                            {t("common.today")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>{t("landing.previewLectureTime")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{t("landing.previewLectureHall")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
                        <span>{t("landing.previewProjectNote")}</span>
                        <StickyNote className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-foreground leading-snug">
                        {t("landing.previewNoteContent")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-16 sm:py-24 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("landing.featuresBadge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("landing.featuresTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <Card key={feat.title} hoverable className="group border-border hover:border-primary/40 transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-200">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60">
                          {feat.badge}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {feat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {feat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section id="courses" className="py-16 sm:py-24 border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("landing.curriculumBadge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("landing.curriculumTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("landing.curriculumSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COURSES.map((course, idx) => (
                <div
                  key={course.code}
                  className="group rounded-xl border border-border bg-card p-5 space-y-2 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded-md bg-primary/10">
                      {course.code}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">#{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1.5 border-t border-border/70">
                    {course.description}
                  </p>
                </div>
              ))}

              {/* Extra Summary Box */}
              <div className="rounded-xl border border-dashed border-border bg-card/60 p-5 flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{t("landing.groupsCardTitle")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("landing.groupsCardDesc")}
                  </p>
                </div>
                <Link href={isLoggedIn ? "/selectschedule" : "/signup"} className="pt-4">
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                    <span>{t("landing.configureGroups")}</span>
                    <ChevronIcon className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / How It Works */}
        <section id="workflow" className="py-16 sm:py-24 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("landing.workflowBadge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("landing.workflowTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("landing.workflowSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="flex flex-col items-start space-y-3 p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/30 transition-colors">
                  <span className="text-3xl font-extrabold text-primary/40 font-mono">{s.step}</span>
                  <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-secondary/40 to-background border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t("landing.ctaSubtitle")}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLoggedIn ? (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => router.push("/home")}
                  className="w-full sm:w-auto gap-2 px-8 text-base"
                >
                  <span>{t("landing.ctaOpenFeed")}</span>
                  <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" variant="primary" className="w-full gap-2 px-8 text-base">
                      <span>{t("landing.ctaCreateAccount")}</span>
                      <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full gap-2 px-8 text-base">
                      <span>{t("landing.ctaSignIn")}</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-border bg-card/60 py-10 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-2xs">
              U
            </div>
            <span>{t("common.copyright", { year: new Date().getFullYear() })}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/diaaelsadek"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline font-medium"
            >
              {t("common.developedBy")} {t("common.authorName")}
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              {t("landing.footerStudentLogin")}
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              {t("landing.footerRegistration")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
