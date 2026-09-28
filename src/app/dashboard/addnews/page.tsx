"use client";

import React, { useState, useEffect, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import NewsTable, { DashboardNewsItem } from "@/components/dashboard/NewsTable";
import NewsFormModal, { NewsFormData } from "@/components/dashboard/NewsFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AddNewsPage() {
  const { t } = useLanguage();
  const [news, setNews] = useState<DashboardNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

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

  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    subjectId: 0,
    groupId: 0,
    week: 1,
    priorty: "medium",
    publish: true,
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/addnews", { method: "GET" });
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        setNews(json.data.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (err) {
      console.error("Failed to load dashboard news:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: t("common.error"),
        message: "Failed to fetch announcements list.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setFormData({
      title: "",
      content: "",
      subjectId: 0,
      groupId: 0,
      week: 1,
      priorty: "medium",
      publish: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: DashboardNewsItem) => {
    setIsEdit(true);
    setEditId(item.id);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      subjectId: item.subjectId || 0,
      groupId: item.groupId || 0,
      week: item.week || 1,
      priorty: item.priorty?.toLowerCase() || "medium",
      publish: Boolean(item.publish),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setToast({
        isOpen: true,
        type: "error",
        title: t("common.error"),
        message: "Title and content are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const body = {
        ...formData,
        createdBy: localStorage.getItem("fullName") || "Admin",
        createdAt: now,
      };

      const res = await fetch("/api/dashboard/addnews", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: editId, ...body } : body),
      });

      const json = await res.json();
      if (json.status) {
        setToast({
          isOpen: true,
          type: "success",
          title: isEdit ? t("dashboard.saveChangesBtn") : t("dashboard.publishBtn"),
          message: isEdit
            ? "Your changes have been saved."
            : "The announcement is now visible on the student feed.",
        });
        setShowModal(false);
        fetchNews();
      } else {
        setToast({
          isOpen: true,
          type: "error",
          title: t("common.error"),
          message: json.message || "Failed to save announcement.",
        });
      }
    } catch (err) {
      console.error("Submit news error:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: t("common.error"),
        message: "An unexpected error occurred.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);

    try {
      const res = await fetch("/api/dashboard/addnews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteConfirmId }),
      });
      const json = await res.json();

      if (json.status) {
        setToast({
          isOpen: true,
          type: "success",
          title: t("common.delete"),
          message: "Announcement was removed successfully.",
        });
        setNews((prev) => prev.filter((n) => n.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      } else {
        setToast({
          isOpen: true,
          type: "error",
          title: t("common.error"),
          message: json.message || "Failed to delete item.",
        });
      }
    } catch (err) {
      console.error("Delete news error:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: t("common.error"),
        message: "Failed to delete announcement.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredList = useMemo(() => {
    return news.filter((item) => {
      if (statusFilter === "published" && !item.publish) return false;
      if (statusFilter === "draft" && item.publish) return false;

      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;

      const title = (item.title || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      const author = (item.createdBy || "").toLowerCase();

      return (
        title.includes(q) ||
        content.includes(q) ||
        author.includes(q) ||
        item.groupId?.toString() === q ||
        item.week?.toString() === q
      );
    });
  }, [news, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = news.length;
    const published = news.filter((n) => n.publish).length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [news]);

  return (
    <PageLayout
      isAdmin={true}
      title={t("dashboard.title")}
      description={t("dashboard.subtitle")}
      action={
        <Button variant="primary" onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{t("dashboard.newAnnouncement")}</span>
        </Button>
      }
    >
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {t("dashboard.totalItems")}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stats.total}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary text-foreground">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {t("dashboard.published")}
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.published}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {t("dashboard.drafts")}
              </p>
              <h3 className="text-2xl font-bold text-muted-foreground mt-1">{stats.drafts}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary text-muted-foreground">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("dashboard.searchPlaceholder")}
            className="w-full rounded-md border border-border bg-card ps-9 pe-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer sm:w-48"
        >
          <option value="all">{t("dashboard.filterAll")}</option>
          <option value="published">{t("dashboard.filterPublished")}</option>
          <option value="draft">{t("dashboard.filterDrafts")}</option>
        </select>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label={t("dashboard.loading")} />
        </div>
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("dashboard.noFoundTitle")}
          description={
            searchTerm
              ? t("dashboard.noFoundDescSearch")
              : t("dashboard.noFoundDescEmpty")
          }
          action={
            searchTerm ? (
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                {t("dashboard.clearSearch")}
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={openCreateModal}>
                {t("dashboard.createAnnouncement")}
              </Button>
            )
          }
        />
      ) : (
        <NewsTable
          items={filteredList}
          onEdit={openEditModal}
          onDelete={setDeleteConfirmId}
        />
      )}

      {/* Create / Edit Modal */}
      <NewsFormModal
        isOpen={showModal}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title={t("dashboard.deleteModalTitle")}
        description={t("dashboard.deleteModalDesc")}
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
            >
              {t("dashboard.cancelBtn")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleting}
            >
              {t("dashboard.deleteBtn")}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{t("dashboard.deleteWarning")}</span>
        </div>
      </Modal>
    </PageLayout>
  );
}