"use client";

import React, { useEffect, useState, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import EmptyState from "@/components/EmptyState";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  Pin,
  PinOff,
  Trash2,
  Palette,
  Plus,
  Save,
  StickyNote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export type NoteColor = "amber" | "sky" | "emerald" | "purple" | "rose";

export type Note = {
  id: number;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  date: string;
};

const NOTE_COLORS: NoteColor[] = ["amber", "sky", "emerald", "purple", "rose"];

const colorStyles: Record<
  NoteColor,
  { card: string; textarea: string; badge: string; dot: string }
> = {
  amber: {
    card: "bg-amber-500/10 border-amber-500/30",
    textarea: "placeholder:text-amber-700/60 dark:placeholder:text-amber-300/50 text-foreground",
    badge: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  sky: {
    card: "bg-sky-500/10 border-sky-500/30",
    textarea: "placeholder:text-sky-700/60 dark:placeholder:text-sky-300/50 text-foreground",
    badge: "text-sky-700 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  emerald: {
    card: "bg-emerald-500/10 border-emerald-500/30",
    textarea: "placeholder:text-emerald-700/60 dark:placeholder:text-emerald-300/50 text-foreground",
    badge: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  purple: {
    card: "bg-purple-500/10 border-purple-500/30",
    textarea: "placeholder:text-purple-700/60 dark:placeholder:text-purple-300/50 text-foreground",
    badge: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  rose: {
    card: "bg-rose-500/10 border-rose-500/30",
    textarea: "placeholder:text-rose-700/60 dark:placeholder:text-rose-300/50 text-foreground",
    badge: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const nextIdRef = useRef<number>(1);
  const { t, isRTL } = useLanguage();

  // Normalize legacy note color names to new NoteColor palette
  const normalizeColor = (c: string): NoteColor => {
    if (c === "note-yellow" || c === "amber") return "amber";
    if (c === "note-blue" || c === "sky") return "sky";
    if (c === "note-green" || c === "emerald") return "emerald";
    if (c === "note-purple" || c === "purple") return "purple";
    if (c === "note-pink" || c === "rose") return "rose";
    return "amber";
  };

  const loadNotes = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`/api/stickyNotes?userToken=${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.stickyNotes && Array.isArray(data.stickyNotes)) {
          const formatted: Note[] = data.stickyNotes.map((n: any) => ({
            id: n.id,
            content: n.content || "",
            color: normalizeColor(n.color || "amber"),
            isPinned: Boolean(n.isPinned),
            date:
              n.date ||
              new Date().toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
                month: "short",
                day: "numeric",
              }),
          }));

          setNotes(formatted);
          nextIdRef.current = Math.max(...formatted.map((n) => n.id), 0) + 1;
          return;
        }
      }
    } catch {
      // Fallback to localStorage
    }

    const stored = localStorage.getItem("stickyNotes");
    if (stored) {
      try {
        const parsed: any[] = JSON.parse(stored);
        const formatted: Note[] = parsed.map((n) => ({
          id: n.id,
          content: n.content || "",
          color: normalizeColor(n.color || "amber"),
          isPinned: Boolean(n.isPinned),
          date: n.date || t("common.today"),
        }));
        setNotes(formatted);
        nextIdRef.current = Math.max(...formatted.map((n) => n.id), 0) + 1;
      } catch {
        // Ignore parse error
      }
    }
  };

  const saveNotesToServer = async (currentNotes: Note[]) => {
    setSaving(true);
    try {
      localStorage.setItem("stickyNotes", JSON.stringify(currentNotes));

      const token = localStorage.getItem("userToken");
      if (!token) {
        setSaving(false);
        return;
      }

      const res = await fetch("/api/stickyNotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userToken: token, stickyNotes: currentNotes }),
      });

      if (res.ok) {
        setToast({
          isOpen: true,
          type: "success",
          title: t("notes.toastSavedTitle"),
          message: t("notes.toastSavedMsg"),
        });
      }
    } catch (err) {
      console.error("Save notes error:", err);
      setToast({
        isOpen: true,
        type: "error",
        title: t("notes.toastSyncErrorTitle"),
        message: t("notes.toastSyncErrorMsg"),
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadNotes();
    const userRole = localStorage.getItem("role");
    setIsAdmin(userRole === "admin");
  }, []);

  const addNewNote = () => {
    const id = nextIdRef.current++;
    const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const newNote: Note = {
      id,
      content: "",
      color: randomColor,
      isPinned: false,
      date: new Date().toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotesToServer(updated);
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotesToServer(updated);
  };

  const togglePin = (id: number) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setNotes(updated);
    saveNotesToServer(updated);
  };

  const changeColor = (id: number) => {
    const updated = notes.map((n) => {
      if (n.id === id) {
        const currentIndex = NOTE_COLORS.indexOf(n.color);
        const nextColor = NOTE_COLORS[(currentIndex + 1) % NOTE_COLORS.length];
        return { ...n, color: nextColor };
      }
      return n;
    });
    setNotes(updated);
    saveNotesToServer(updated);
  };

  const updateContent = (id: number, content: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, content } : n));
    setNotes(updated);
    localStorage.setItem("stickyNotes", JSON.stringify(updated));
  };

  const deleteAll = () => {
    if (window.confirm(t("notes.clearConfirm"))) {
      setNotes([]);
      saveNotesToServer([]);
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  const renderNoteCard = (note: Note) => {
    const style = colorStyles[note.color] || colorStyles.amber;

    return (
      <div
        key={note.id}
        className={cn(
          "flex flex-col rounded-lg border p-4 transition-all duration-150 h-56 shadow-xs",
          style.card
        )}
      >
        {/* Note Card Header */}
        <div className="flex items-center justify-between gap-1 pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("w-2 h-2 rounded-full", style.dot)} aria-hidden="true" />
            <span>{note.date}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => togglePin(note.id)}
              className={cn(
                "p-1 rounded-md transition-colors cursor-pointer",
                note.isPinned
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              title={note.isPinned ? t("notes.unpinTooltip") : t("notes.pinTooltip")}
              aria-label={note.isPinned ? t("notes.unpinTooltip") : t("notes.pinTooltip")}
            >
              {note.isPinned ? (
                <Pin className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
              ) : (
                <PinOff className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => changeColor(note.id)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              title={t("notes.colorTooltip")}
              aria-label={t("notes.colorTooltip")}
            >
              <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => deleteNote(note.id)}
              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title={t("notes.deleteTooltip")}
              aria-label={t("notes.deleteTooltip")}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Note Content Input */}
        <textarea
          value={note.content}
          onChange={(e) => updateContent(note.id, e.target.value)}
          onBlur={() => saveNotesToServer(notes)}
          placeholder={t("notes.textareaPlaceholder")}
          dir="auto"
          className={cn(
            "flex-1 w-full bg-transparent resize-none p-1 pt-2.5 text-sm leading-relaxed focus:outline-none",
            style.textarea
          )}
        />
      </div>
    );
  };

  return (
    <PageLayout
      isAdmin={isAdmin}
      title={t("notes.title")}
      description={t("notes.subtitle")}
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveNotesToServer(notes)}
            isLoading={saving}
            className="gap-1.5"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{t("notes.saveAll")}</span>
          </Button>

          <Button variant="primary" size="sm" onClick={addNewNote} className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{t("notes.newNote")}</span>
          </Button>
        </div>
      }
    >
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={t("notes.emptyTitle")}
          description={t("notes.emptyDesc")}
          action={
            <Button variant="primary" onClick={addNewNote} className="gap-1.5">
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{t("notes.createNoteBtn")}</span>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-border">
                <Pin className="h-4 w-4 text-primary fill-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("notes.pinnedNotes")} ({pinnedNotes.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </section>
          )}

          {/* Other Notes Section */}
          <section className="space-y-3">
            {pinnedNotes.length > 0 && (
              <div className="flex items-center justify-between pb-1 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("notes.allNotes")} ({unpinnedNotes.length})
                </h2>
                {notes.length > 3 && (
                  <button
                    type="button"
                    onClick={deleteAll}
                    className="text-xs text-destructive hover:underline cursor-pointer"
                  >
                    {t("notes.clearAll")}
                  </button>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unpinnedNotes.map(renderNoteCard)}
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
}