"use client";

import React from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  "معالجة الصور الرقمية",
  "الحوسبة السحابية",
  "التنقيب على البيانات",
  "اتصالات البيانات",
  "مشروع تخرج 1",
];

const GROUPS = [1, 2, 3, 4, 5, 6];
const PRIORITIES = ["low", "medium", "high"];

export interface NewsFormData {
  title: string;
  content: string;
  subjectId: number;
  groupId: number;
  week: number;
  priorty: string;
  publish: boolean;
}

interface NewsFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: NewsFormData;
  setFormData: React.Dispatch<React.SetStateAction<NewsFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  saving: boolean;
}

export default function NewsFormModal({
  isOpen,
  isEdit,
  formData,
  setFormData,
  onSubmit,
  onClose,
  saving,
}: NewsFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Announcement" : "Create New Announcement"}
      description="Enter the announcement details to notify students."
      maxWidth="xl"
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-2">
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="modal-title-input"
            className="block text-xs font-semibold uppercase text-foreground"
          >
            Announcement Title *
          </label>
          <input
            id="modal-title-input"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Lab Assignment #3 Submission Deadline"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Course, Group, Week, Priority Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="modal-subject"
              className="block text-xs font-semibold text-muted-foreground"
            >
              Course
            </label>
            <select
              id="modal-subject"
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({ ...formData, subjectId: Number(e.target.value) })
              }
              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <option value={0}>Global (All Courses)</option>
              {SUBJECTS.map((subj, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="modal-group"
              className="block text-xs font-semibold text-muted-foreground"
            >
              Group
            </label>
            <select
              id="modal-group"
              value={formData.groupId}
              onChange={(e) =>
                setFormData({ ...formData, groupId: Number(e.target.value) })
              }
              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <option value={0}>Global (All Groups)</option>
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  Group {g}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="modal-week"
              className="block text-xs font-semibold text-muted-foreground"
            >
              Week
            </label>
            <select
              id="modal-week"
              value={formData.week}
              onChange={(e) =>
                setFormData({ ...formData, week: Number(e.target.value) })
              }
              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="modal-priority"
              className="block text-xs font-semibold text-muted-foreground"
            >
              Priority
            </label>
            <select
              id="modal-priority"
              value={formData.priorty}
              onChange={(e) => setFormData({ ...formData, priorty: e.target.value })}
              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <label
            htmlFor="modal-content-input"
            className="block text-xs font-semibold uppercase text-foreground"
          >
            Announcement Body *
          </label>
          <textarea
            id="modal-content-input"
            required
            rows={6}
            dir="auto"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter announcement text, assignment details, or links..."
            className="w-full rounded-md border border-border bg-card p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary leading-relaxed"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="modal-publish"
            checked={formData.publish}
            onChange={(e) => setFormData({ ...formData, publish: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="modal-publish"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Publish immediately (visible to students)
          </label>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={saving}>
            {isEdit ? "Update Announcement" : "Publish Announcement"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
