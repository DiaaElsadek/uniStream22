"use client";

import React, { useEffect, useState, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import EmptyState from "@/components/EmptyState";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pin,
  PinOff,
  Trash2,
  Palette,
  Plus,
  Save,
  StickyNote,
  Layers,
  AlertTriangle,
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
  { card: string; textarea: string; dot: string; border: string }
> = {
  amber: {
    card: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30",
    textarea: "placeholder:text-amber-700/60 dark:placeholder:text-amber-300/50 text-foreground",
    dot: "bg-amber-500",
    border: "hover:border-amber-500/60",
  },
  sky: {
    card: "bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/30",
    textarea: "placeholder:text-sky-700/60 dark:placeholder:text-sky-300/50 text-foreground",
    dot: "bg-sky-500",
    border: "hover:border-sky-500/60",
  },
  emerald: {
    card: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30",
    textarea: "placeholder:text-emerald-700/60 dark:placeholder:text-emerald-300/50 text-foreground",
    dot: "bg-emerald-500",
    border: "hover:border-emerald-500/60",
  },
  purple: {
    card: "bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/30",
    textarea: "placeholder:text-purple-700/60 dark:placeholder:text-purple-300/50 text-foreground",
    dot: "bg-purple-500",
    border: "hover:border-purple-500/60",
  },
  rose: {
    card: "bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30",
    textarea: "placeholder:text-rose-700/60 dark:placeholder:text-rose-300/50 text-foreground",
    dot: "bg-rose-500",
    border: "hover:border-rose-500/60",
  },
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");
  const [showClearDialog, setShowClearDialog] = useState(false);
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

      const cached = localStorage.getItem("stickyNotes");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const formatted: Note[] = parsed.map((n: any, idx: number) => ({
              id: n.id ?? idx + 1,
              content: n.content ?? "",
              color: normalizeColor(n.color ?? "amber"),
              isPinned: Boolean(n.isPinned),
              date: n.date || t("common.today"),
            }));
            setNotes(formatted);
            nextIdRef.current = Math.max(...formatted.map((n: Note) => n.id), 0) + 1;
          }
        } catch {
          // Ignore
        }
      }

      const res = await fetch(`/api/stickyNotes?userToken=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (data.status && Array.isArray(data.stickyNotes)) {
        const formatted: Note[] = data.stickyNotes.map((n: any, idx: number) => ({
          id: n.id ?? idx + 1,
          content: n.content ?? "",
          color: normalizeColor(n.color ?? "amber"),
          isPinned: Boolean(n.isPinned),
          date: n.date || t("common.today"),
        }));
        setNotes(formatted);
        nextIdRef.current = Math.max(...formatted.map((n: Note) => n.id), 0) + 1;
        localStorage.setItem("stickyNotes", JSON.stringify(formatted));
      }
    } catch {
      const cached = localStorage.getItem("stickyNotes");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const formatted: Note[] = parsed.map((n: any, idx: number) => ({
            id: n.id ?? idx + 1,
            content: n.content ?? "",
            color: normalizeColor(n.color ?? "amber"),
            isPinned: Boolean(n.isPinned),
            date: n.date || t("common.today"),
          }));
          setNotes(formatted);
          nextIdRef.current = Math.max(...formatted.map((n: Note) => n.id), 0) + 1;
        } catch {
          // Ignore
        }
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

  const addNewNote = (specificColor?: NoteColor) => {
    const id = nextIdRef.current++;
    const color = specificColor || NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const newNote: Note = {
      id,
      content: "",
      color,
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

  const confirmDeleteAll = () => {
    setNotes([]);
    saveNotesToServer([]);
    setShowClearDialog(false);
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);
  const displayedNotes = activeTab === "pinned" ? pinnedNotes : notes;

  const renderNoteCard = (note: Note) => {
    const style = colorStyles[note.color] || colorStyles.amber;

    return (
      <div
        key={note.id}
        className={cn(
          "group flex flex-col rounded-2xl border p-4 transition-all duration-200 h-64 shadow-2xs hover:-translate-y-1 hover:shadow-md bg-card/90 backdrop-blur-xs",
          style.card,
          style.border
        )}
      >
        {/* Note Card Header */}
        <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-border/30">
          <Badge variant="outline" size="sm" className="gap-1.5 bg-background/50 font-medium">
            <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} aria-hidden="true" />
            <span>{note.date}</span>
          </Badge>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => togglePin(note.id)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-95",
                    note.isPinned
                      ? "text-primary bg-primary/20 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  )}
                  aria-label={note.isPinned ? t("notes.unpinTooltip") : t("notes.pinTooltip")}
                >
                  {note.isPinned ? (
                    <Pin className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
                  ) : (
                    <PinOff className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {note.isPinned ? t("notes.unpinTooltip") : t("notes.pinTooltip")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => changeColor(note.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/60 transition-all duration-150 cursor-pointer active:scale-95"
                  aria-label={t("notes.colorTooltip")}
                >
                  <Palette className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t("notes.colorTooltip")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-all duration-150 cursor-pointer active:scale-95"
                  aria-label={t("notes.deleteTooltip")}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t("notes.deleteTooltip")}</TooltipContent>
            </Tooltip>
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
            "flex-1 w-full bg-transparent resize-none p-1 pt-3 text-sm leading-relaxed focus:outline-none",
            style.textarea
          )}
        />

        {/* Note Footer: Character Counter */}
        <div className="pt-2 border-t border-border/20 flex justify-end text-[10px] text-muted-foreground/80 font-mono">
          <span>{note.content.length} chars</span>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
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
              className="gap-1.5 shadow-2xs"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>{t("notes.saveAll")}</span>
            </Button>

            <Button variant="primary" size="sm" onClick={() => addNewNote()} className="gap-1.5 shadow-xs">
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
              <Button variant="primary" onClick={() => addNewNote()} className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>{t("notes.createNoteBtn")}</span>
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Filter Tabs & Quick Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="w-full sm:w-auto"
              >
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all" className="gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{t("notes.allNotes") || "All"}</span>
                    <Badge variant="secondary" size="sm" className="ms-1 px-1.5 py-0 text-[10px]">
                      {notes.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pinned" className="gap-1.5">
                    <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span>{t("notes.pinnedNotes") || "Pinned"}</span>
                    {pinnedNotes.length > 0 && (
                      <Badge variant="accent" size="sm" className="ms-1 px-1.5 py-0 text-[10px]">
                        {pinnedNotes.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {notes.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowClearDialog(true)}
                  className="text-xs font-semibold text-destructive hover:underline cursor-pointer self-end sm:self-center"
                >
                  {t("notes.clearAll")}
                </button>
              )}
            </div>

            {/* Notes Grid */}
            {activeTab === "pinned" ? (
              pinnedNotes.length === 0 ? (
                <EmptyState
                  icon={Pin}
                  title={t("notes.noPinnedTitle") || "No pinned notes"}
                  description={t("notes.noPinnedDesc") || "Click the pin icon on any note to keep it at the top."}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinnedNotes.map(renderNoteCard)}
                </div>
              )
            ) : (
              <div className="space-y-8">
                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Pin className="h-4 w-4 text-primary fill-primary" aria-hidden="true" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        {t("notes.pinnedNotes")} ({pinnedNotes.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {pinnedNotes.map(renderNoteCard)}
                    </div>
                  </section>
                )}

                {/* Unpinned Section */}
                <section className="space-y-3">
                  {pinnedNotes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        {t("notes.allNotes")} ({unpinnedNotes.length})
                      </h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unpinnedNotes.map(renderNoteCard)}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* Clear All Confirmation Dialog using shadcn Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>{t("notes.clearAll")}</span>
              </DialogTitle>
              <DialogDescription>
                {t("notes.clearConfirm") || "Are you sure you want to delete all your sticky notes? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button variant="danger" onClick={confirmDeleteAll}>
                {t("notes.clearAll") || "Delete All"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </TooltipProvider>
  );
}