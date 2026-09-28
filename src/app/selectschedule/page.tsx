"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Check, Save } from "lucide-react";
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

  const handleSelect = (subject: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [subject]: value === "null" ? null : Number(value),
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
        <div className="space-y-3">
          {SUBJECTS.map((subj, index) => {
            const currentVal = selected[subj] ?? "null";
            const isConfigured = currentVal !== "null";

            return (
              <Card
                key={subj}
                className={cn(
                  "border transition-all duration-150 rounded-2xl shadow-2xs",
                  isConfigured ? "border-primary/40 bg-card" : "border-border/80 bg-card"
                )}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors",
                        isConfigured
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {subj}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {t("selectSchedule.coursePrefix")} #{index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor={`select-${index}`} className="sr-only">
                      Select group for {subj}
                    </label>
                    <div className="relative w-full sm:w-52">
                      <select
                        id={`select-${index}`}
                        value={currentVal}
                        onChange={(e) => handleSelect(subj, e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all cursor-pointer shadow-2xs hover:border-border-strong"
                      >
                        <option value="null">{t("selectSchedule.noneOption")}</option>
                        {GROUP_OPTIONS.map((num) => (
                          <option key={num} value={num}>
                            {t("selectSchedule.groupOption", { num })}
                          </option>
                        ))}
                      </select>
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
            className="w-full sm:w-auto gap-2"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{t("selectSchedule.saveSchedule")}</span>
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t("selectSchedule.modalTitle")}
        description={t("selectSchedule.modalDesc")}
        footer={
          <>
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
          </>
        }
      >
        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {SUBJECTS.map((subj) => (
            <div
              key={subj}
              className="flex items-center justify-between p-3.5 text-sm bg-card"
            >
              <span className="font-semibold text-foreground">
                {subj}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-foreground">
                <Users className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                {selected[subj]
                  ? t("selectSchedule.groupOption", { num: selected[subj] })
                  : t("selectSchedule.noneOption")}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </PageLayout>
  );
}