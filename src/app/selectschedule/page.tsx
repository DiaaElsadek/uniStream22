"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Toast from "@/components/Toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Users, Check, Save, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب عن البيانات",
  "اتصالات البيانات",
  "مشروع تخرج 1",
];

const GROUP_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function SelectSchedulePage() {
  const [selected, setSelected] = useState<Record<string, number | null>>({});
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const router = useRouter();
  const { t } = useLanguage();

  const handleSelect = (subject: string, value: number | null) => {
    setSelected((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        setToast({
          isOpen: true,
          type: "error",
          title: t("selectSchedule.sessionExpiredTitle"),
          message: t("selectSchedule.sessionExpiredMsg"),
        });
        setTimeout(() => router.replace("/login"), 1500);
        return;
      }

      const res = await fetch("/api/selectschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected, userToken }),
      });

      const data = await res.json();
      if (data.status) {
        setToast({
          isOpen: true,
          type: "success",
          title: t("selectSchedule.savedSuccessTitle"),
          message: t("selectSchedule.savedSuccessMsg"),
        });
        setShowModal(false);
        setTimeout(() => router.replace("/home"), 1000);
      } else {
        setToast({
          isOpen: true,
          type: "error",
          title: t("selectSchedule.savedFailedTitle"),
          message: data.message || "Failed to update your groups. Please try again.",
        });
      }
    } catch (err) {
      console.error("Save schedule error:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: t("common.error"),
        message: "A network error occurred while saving your choices.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      maxWidth="narrow"
      title={t("selectSchedule.title")}
      description={t("selectSchedule.subtitle")}
    >
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="space-y-6">
        {/* Subject Selection Grid */}
        <div className="space-y-3.5">
          {SUBJECTS.map((subj, index) => {
            const currentVal = selected[subj] ?? null;
            const isConfigured = currentVal !== null;
            const initial = subj.charAt(0);

            return (
              <Card
                key={subj}
                className={cn(
                  "border transition-all duration-200 rounded-2xl shadow-2xs overflow-hidden",
                  isConfigured
                    ? "border-primary/50 bg-card ring-1 ring-primary/20"
                    : "border-border/80 bg-card/95 hover:border-border-strong"
                )}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border-primary/20 bg-primary/10">
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          {subj}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {t("selectSchedule.coursePrefix")} #{index + 1}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={isConfigured ? "success" : "secondary"}
                      size="sm"
                      className="font-medium"
                    >
                      {isConfigured
                        ? t("selectSchedule.groupOption", { num: currentVal })
                        : t("selectSchedule.noneOption")}
                    </Badge>
                  </div>

                  {/* Interactive Group Selector Chips */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                      {t("home.groupPrefix") || "Choose Group"}:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelect(subj, null)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                          currentVal === null
                            ? "bg-secondary text-foreground border-border shadow-xs font-bold"
                            : "bg-background/60 text-muted-foreground border-border/60 hover:bg-secondary/70 hover:text-foreground"
                        )}
                      >
                        {t("selectSchedule.noneOption")}
                      </button>

                      {GROUP_OPTIONS.map((num) => {
                        const active = currentVal === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleSelect(subj, num)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1",
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-[1.02]"
                                : "bg-background/60 text-foreground border-border/70 hover:border-primary/40 hover:bg-secondary/70"
                            )}
                          >
                            {active && <Check className="h-3 w-3" />}
                            <span>{t("selectSchedule.groupOption", { num })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <Button
            size="lg"
            variant="primary"
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto gap-2 shadow-sm"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{t("selectSchedule.saveSchedule")}</span>
          </Button>
        </div>
      </div>

      {/* Review Dialog using shadcn Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("selectSchedule.modalTitle")}</span>
            </DialogTitle>
            <DialogDescription>
              {t("selectSchedule.modalDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden my-2">
            {SUBJECTS.map((subj) => (
              <div
                key={subj}
                className="flex items-center justify-between p-3.5 text-sm bg-card"
              >
                <span className="font-semibold text-foreground">
                  {subj}
                </span>
                <Badge
                  variant={selected[subj] ? "accent" : "secondary"}
                  size="sm"
                  className="gap-1.5 font-medium"
                >
                  <Users className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {selected[subj]
                      ? t("selectSchedule.groupOption", { num: selected[subj] })
                      : t("selectSchedule.noneOption")}
                  </span>
                </Badge>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              {t("selectSchedule.cancelBtn")}
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={saving}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>{t("selectSchedule.confirmBtn")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}