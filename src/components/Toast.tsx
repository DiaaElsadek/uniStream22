"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/30",
    iconColor: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  error: {
    icon: AlertCircle,
    border: "border-red-500/30",
    iconColor: "text-red-500",
    bg: "bg-red-500/10",
  },
  info: {
    icon: Info,
    border: "border-primary/30",
    iconColor: "text-primary",
    bg: "bg-primary/10",
  },
};

export default function Toast({
  type = "info",
  title,
  message,
  isOpen,
  onClose,
  duration = 4000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen || duration <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-start gap-3 w-full max-w-sm rounded-lg border bg-card p-4 text-card-foreground shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200",
        config.border,
        className
      )}
    >
      <div className={cn("rounded-md p-1", config.bg)}>
        <Icon className={cn("w-4 h-4", config.iconColor)} aria-hidden="true" />
      </div>

      <div className="flex-1 space-y-1 pr-2">
        <h4 className="text-sm font-semibold text-foreground leading-tight">{title}</h4>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
