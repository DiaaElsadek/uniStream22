"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  StickyNote,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import UniStreamLogo from "./UniStreamLogo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resolvedIsAdmin, setResolvedIsAdmin] = useState(Boolean(isAdmin));
  const [academicId, setAcademicId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof isAdmin === "boolean") {
      setResolvedIsAdmin(isAdmin);
    } else {
      const storedRole = localStorage.getItem("role");
      setResolvedIsAdmin(storedRole === "admin");
    }

    try {
      const storedId = localStorage.getItem("academicId");
      if (storedId) setAcademicId(storedId);
    } catch {
      // Ignore
    }
  }, [isAdmin]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: t("nav.home"), href: "/home", icon: Home },
    { name: t("nav.schedule"), href: "/schedule", icon: Calendar },
    { name: t("nav.notes"), href: "/notes", icon: StickyNote },
    ...(resolvedIsAdmin
      ? [{ name: t("nav.dashboard"), href: "/dashboard/addnews", icon: LayoutDashboard }]
      : []),
  ];

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch {
      // Ignore localStorage errors
    }
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home" || pathname.startsWith("/new/");
    }
    return pathname.startsWith(href);
  };

  const userInitial = academicId ? academicId.slice(-2) : "22";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/home"
          className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1 py-0.5"
        >
          <UniStreamLogo size={32} />
          <span className="font-extrabold tracking-tight">UniStream22</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls (Language, Theme & Profile Dropdown) */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-border mx-1" aria-hidden="true" />

          {/* User Profile Dropdown using shadcn DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1 text-sm font-medium text-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer transition-colors border border-transparent hover:border-border"
                aria-label="User Account Menu"
              >
                <Avatar className="h-8 w-8 rounded-lg border-primary/20 bg-primary/10">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-1">
                <span className="text-xs text-muted-foreground block">
                  {resolvedIsAdmin ? "Administrator" : "Student Account"}
                </span>
                {academicId && (
                  <Badge variant="secondary" size="sm" className="font-mono text-[11px] font-semibold">
                    ID: {academicId}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/selectschedule" className="flex items-center gap-2 w-full">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span>{t("schedule.editGroups")}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/notes" className="flex items-center gap-2 w-full">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  <span>{t("nav.notes")}</span>
                </Link>
              </DropdownMenuItem>

              {resolvedIsAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/addnews" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>{t("nav.dashboard")}</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-2 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Controls (Language + Theme + Hamburger) */}
        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border text-foreground hover:bg-secondary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {academicId && (
            <div className="pb-2.5 mb-2.5 border-b border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Logged in student:</span>
              <Badge variant="secondary" size="sm" className="font-mono text-xs">
                {academicId}
              </Badge>
            </div>
          )}

          <nav className="flex flex-col gap-1 pb-2" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <Link
              href="/selectschedule"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t("schedule.editGroups")}</span>
            </Link>
          </nav>

          <div className="border-t border-border pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>{t("nav.logout")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
