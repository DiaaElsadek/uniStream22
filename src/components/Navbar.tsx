"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  Home,
  Calendar,
  StickyNote,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
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

  useEffect(() => {
    if (typeof isAdmin === "boolean") {
      setResolvedIsAdmin(isAdmin);
    } else {
      const storedRole = localStorage.getItem("role");
      setResolvedIsAdmin(storedRole === "admin");
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <span>UniStream22</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls (Language, Theme & Logout) */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive cursor-pointer"
            title={t("nav.logout")}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>

        {/* Mobile Controls (Language + Theme + Hamburger) */}
        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
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
        <div className="md:hidden border-b border-border bg-card px-4 py-3 shadow-md animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1 pb-2" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
