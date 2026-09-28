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
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  Sparkles,
  Layers,
  MapPin,
  Hash,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";

const COURSES = [
  {
    code: "CS401",
    nameEn: "Digital Image Processing",
    nameAr: "معالجة الصور الرقمية",
    description: "Image enhancement, spatial filtering, frequency domain, and edge detection.",
  },
  {
    code: "CS402",
    nameEn: "Cloud Computing",
    nameAr: "الحوسبة السحابية",
    description: "Cloud architectures, virtualization, serverless models, and distributed systems.",
  },
  {
    code: "CS403",
    nameEn: "Data Mining",
    nameAr: "التنقيب على البيانات",
    description: "Pattern evaluation, classification algorithms, clustering, and association rules.",
  },
  {
    code: "CS404",
    nameEn: "Data Communications",
    nameAr: "اتصالات البيانات",
    description: "Network protocols, OSI reference model, transmission media, and routing logic.",
  },
  {
    code: "CS405",
    nameEn: "Graduation Project 1",
    nameAr: "مشروع تخرج 1",
    description: "Problem formulation, literature review, systems architecture, and milestones.",
  },
];

const FEATURES = [
  {
    icon: Newspaper,
    title: "Centralized Academic Feed",
    description:
      "All lecture slides, assignment deadlines, and department alerts published directly by faculty, sorted by week and priority.",
    badge: "Announcements",
  },
  {
    icon: Calendar,
    title: "Personalized Timetable",
    description:
      "A weekly class schedule built automatically from your assigned lab and lecture groups, highlighting today's upcoming sessions.",
    badge: "Schedule",
  },
  {
    icon: Users,
    title: "Group-Specific Filtering",
    description:
      "Never miss an announcement meant for your section. Filter feeds and classes by Group 1 through 6 or global announcements.",
    badge: "Smart Routing",
  },
  {
    icon: StickyNote,
    title: "Personal Study Scratchpad",
    description:
      "Create study notes, checklist items, and exam reminders on a clean personal board with color tags and instant cloud sync.",
    badge: "Productivity",
  },
  {
    icon: Smartphone,
    title: "Instant PWA & Offline Support",
    description:
      "Install UniStream22 directly onto your phone or laptop. Fast loading and reliable offline access even in poor campus connectivity.",
    badge: "Progressive Web App",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Student-Focused",
    description:
      "Verified student accounts tied to your HTI Academic ID. Clean, calm academic interface with zero ads and zero visual clutter.",
    badge: "Privacy First",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Student Profile",
    description: "Register with your 8-digit HTI academic ID (4202xxxx) and set up your secure password.",
  },
  {
    step: "02",
    title: "Select Course Sections",
    description: "Choose your assigned section and lab group for each of the 5 Fourth-Year CS courses.",
  },
  {
    step: "03",
    title: "Access Everything in One Place",
    description: "View your personalized timetable, read course updates, and manage your study notes.",
  },
];

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xs transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">UniStream22</span>
              <span className="text-[10px] text-muted-foreground font-medium">HTI Computer Science</span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-foreground transition-colors">
              Interface
            </a>
            <a href="#courses" className="hover:text-foreground transition-colors">
              Curriculum
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              How It Works
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {isLoggedIn ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/home")}
                className="gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5">
                    <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Register</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border bg-gradient-to-b from-background via-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              {/* Academic Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-secondary border border-border text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Higher Technological Institute • CS Class of 2026</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Your Entire Academic Semester in One Calm, Focused Space.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                UniStream22 organizes departmental announcements, personalized weekly lecture schedules, lab
                groups, and study notes for 4th-year computer science students — fast, clean, and distraction-free.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {isLoggedIn ? (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => router.push("/home")}
                    className="w-full sm:w-auto gap-2 px-6 h-11 text-base"
                  >
                    <span>Launch Student Feed</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <>
                    <Link href="/signup" className="w-full sm:w-auto">
                      <Button size="lg" variant="primary" className="w-full gap-2 px-6 h-11 text-base">
                        <span>Get Started Free</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full gap-2 px-6 h-11 text-base">
                        <span>Sign In to Account</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>Verified 4202 ID Access</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>No Ads or Clutter</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span>Installable PWA</span>
                </span>
              </div>
            </div>

            {/* Live-Feel UI Preview Mockup */}
            <div id="preview" className="mt-12 sm:mt-16 max-w-5xl mx-auto">
              <div className="rounded-xl border border-border bg-card p-2 sm:p-4 shadow-xl">
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="px-3 py-1 rounded-md bg-secondary text-[11px] font-mono text-muted-foreground truncate max-w-xs sm:max-w-md">
                    unistream22.vercel.app/home
                  </div>
                  <div className="text-[11px] font-medium text-foreground">Semester 2 Preview</div>
                </div>

                {/* Mock Content Layout */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/50 rounded-b-lg">
                  {/* Left Column: Sample Announcement Card */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                      <span className="font-semibold text-foreground uppercase tracking-wider">
                        Latest Announcement (Week 4)
                      </span>
                      <span className="text-primary font-medium">Just Published</span>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          High Priority
                        </span>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Week 4
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-foreground">
                        Digital Image Processing — Lab Assignment #3 Guidelines
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" dir="rtl">
                        برجاء تسليم كود الفلترة المكانية (Spatial Filtering) على منصة المعهد قبل يوم الخميس القادم الساعة 11:59 مساءً.
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <BookOpen className="w-3.5 h-3.5 text-primary" /> معالجة الصور الرقمية
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Group 2
                        </span>
                        <span className="inline-flex items-center gap-1 ml-auto">
                          <Calendar className="w-3.5 h-3.5" /> Oct 24
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Schedule & Sticky Note Snippet */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Today&apos;s Lecture
                      </span>
                      <div className="rounded-lg border border-primary/40 bg-card p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Cloud Computing</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-semibold">
                            Today
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>9:00 AM - 10:40 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>Hall B3 (Faculty Building)</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
                        <span>Project Note</span>
                        <StickyNote className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-foreground leading-snug">
                        Finalize dataset preprocessing for Data Mining project with team before Sunday.
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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Features Built for Focus</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Engineered for Academic Clarity
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Every tool is intentionally crafted to save you time and remove distractions throughout your final academic year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <Card key={feat.title} className="border-border hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {feat.badge}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground">{feat.title}</CardTitle>
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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">4th Year CS Curriculum</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Courses Supported
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Full integration for all Semester 2 lecture schedules, lab sections, and assignments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COURSES.map((course, idx) => (
                <div
                  key={course.code}
                  className="rounded-lg border border-border bg-card p-5 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      {course.code}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Course #{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{course.nameEn}</h3>
                  <p className="text-sm font-semibold text-primary/90" dir="rtl">
                    {course.nameAr}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border">
                    {course.description}
                  </p>
                </div>
              ))}

              {/* Extra Summary Box */}
              <div className="rounded-lg border border-dashed border-border bg-card/60 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Lab & Section Groups</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Custom group allocation for Groups 1 to 6. Switch your section anytime to update your schedule instantly.
                  </p>
                </div>
                <Link href={isLoggedIn ? "/selectschedule" : "/signup"} className="pt-4">
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                    <span>Configure Groups</span>
                    <ChevronRight className="h-3.5 w-3.5" />
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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Onboarding</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Up and Running in 30 Seconds
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                No complex verification or complicated setup. Designed specifically for HTI CS students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="flex flex-col items-start space-y-3 relative">
                  <span className="text-3xl font-extrabold text-primary/40 font-mono">{s.step}</span>
                  <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ready for a Smoother Semester?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Join your fellow HTI Fourth-Year CS colleagues and stay on top of all your lectures and notices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLoggedIn ? (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => router.push("/home")}
                  className="w-full sm:w-auto gap-2 px-8 h-11"
                >
                  <span>Open Your Feed</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" variant="primary" className="w-full gap-2 px-8 h-11">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full gap-2 px-8 h-11">
                      <span>Sign In</span>
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
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              U
            </div>
            <span>© {new Date().getFullYear()} UniStream22 • Higher Technological Institute</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/diaaelsadek"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Created by Diaa Elsadek
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Student Login
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Registration
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
