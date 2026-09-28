"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Check, AlertCircle, Save } from "lucide-react";

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
          title: "Session Expired",
          message: "Please sign in again to save your schedule.",
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
          title: "Selections Saved",
          message: "Your schedule groups have been updated successfully.",
        });
        setShowModal(false);
        setTimeout(() => router.replace("/home"), 1000);
      } else {
        setToast({
          isOpen: true,
          type: "error",
          title: "Save Failed",
          message: data.message || "Failed to update your groups. Please try again.",
        });
      }
    } catch (err) {
      console.error("Save schedule error:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: "Unexpected Error",
        message: "A network error occurred while saving your choices.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      maxWidth="narrow"
      title="Select Course Groups"
      description="Choose your assigned section and lab group for each course to configure your personalized timetable."
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

            return (
              <Card key={subj} className="border-border">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary shrink-0">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground" dir="rtl">
                        {subj}
                      </h3>
                      <p className="text-xs text-muted-foreground">Course #{index + 1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor={`select-${index}`} className="sr-only">
                      Select group for {subj}
                    </label>
                    <div className="relative w-full sm:w-48">
                      <select
                        id={`select-${index}`}
                        value={currentVal}
                        onChange={(e) => handleSelect(subj, e.target.value)}
                        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors cursor-pointer"
                      >
                        <option value="null">None (Not Registered)</option>
                        {GROUP_OPTIONS.map((num) => (
                          <option key={num} value={num}>
                            Group {num} (المجموعة {num})
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
            <span>Review & Save Schedule</span>
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Group Selections"
        description="Please review your selected groups before saving your schedule."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={saving}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Confirm & Save</span>
            </Button>
          </>
        }
      >
        <div className="divide-y divide-border rounded-md border border-border overflow-hidden">
          {SUBJECTS.map((subj) => (
            <div
              key={subj}
              className="flex items-center justify-between p-3 text-sm bg-card"
            >
              <span className="font-medium text-foreground" dir="rtl">
                {subj}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-foreground">
                <Users className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                {selected[subj] ? `Group ${selected[subj]}` : "None"}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </PageLayout>
  );
}