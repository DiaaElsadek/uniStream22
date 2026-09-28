"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import UniStreamLogo from "@/components/UniStreamLogo";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBox, setShowInstallBox] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone === true;

    if (isIOS && !isStandalone) {
      setPlatform("ios");
      setShowInstallBox(true);
    } else if (isAndroid) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBox(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBox(false);
  };

  if (!showInstallBox) return null;

  return (
    <div
      role="region"
      aria-label="App Installation Prompt"
      className="fixed bottom-5 left-5 z-50 w-full max-w-sm rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg transition-all animate-in slide-in-from-bottom-2 fade-in duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <UniStreamLogo size={32} />
          <div>
            <h4 className="text-sm font-semibold text-foreground">Install UniStream22</h4>
            <p className="text-xs text-muted-foreground">Faster offline access to your schedule</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInstallBox(false)}
          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Dismiss installation prompt"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        {platform === "ios" ? (
          <p className="text-xs text-muted-foreground">
            Tap <span className="font-semibold text-foreground">Share</span> then{" "}
            <span className="font-semibold text-foreground">Add to Home Screen</span>.
          </p>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={handleInstallClick}
            className="w-full text-xs h-8"
          >
            <Download className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            <span>Install App</span>
          </Button>
        )}
      </div>
    </div>
  );
}