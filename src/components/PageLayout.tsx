"use client";

import React from "react";
import Navbar from "./Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  isAdmin?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  maxWidth?: "default" | "narrow" | "full";
  className?: string;
}

const maxWidthMap = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  full: "max-w-full",
};

export default function PageLayout({
  children,
  title,
  description,
  action,
  isAdmin,
  showNavbar = true,
  showFooter = true,
  maxWidth = "default",
  className,
}: PageLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md focus:outline-none"
      >
        {t("landing.navWorkflow") || "Skip to main content"}
      </a>

      {/* Shared Navbar */}
      {showNavbar && <Navbar isAdmin={isAdmin} />}

      {/* Main Page Content */}
      <main
        id="main-content"
        className={cn(
          "flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
          maxWidthMap[maxWidth],
          className
        )}
      >
        {(title || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border mb-6">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
        )}

        {children}
      </main>

      {/* Minimal, Calm Academic Footer */}
      {showFooter && (
        <footer className="border-t border-border bg-card/50 py-6 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>{t("common.copyright", { year: new Date().getFullYear() })}</p>
            <p>
              {t("common.developedBy")}{" "}
              <a
                href="https://linkedin.com/in/diaaelsadek"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {t("common.authorName")}
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
