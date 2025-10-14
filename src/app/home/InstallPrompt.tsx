"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBox, setShowInstallBox] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBox(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        let hideTimer: any;
        if (showInstallBox) {
            hideTimer = setTimeout(() => setShowInstallBox(false), 5000);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            clearTimeout(hideTimer);
        };
    }, [showInstallBox]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowInstallBox(false);
    };

    if (!showInstallBox) return null;

    return (
        <div className="install-box">
            <div className="install-content">
                <p>📱 ثبّت التطبيق على جهازك لتجربة أسرع!</p>
                <button onClick={handleInstallClick}>تثبيت</button>
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #fff;
                    border: 1px solid #ccc;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    border-radius: 12px;
                    padding: 15px 20px;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .install-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                button {
                    background: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 6px 12px;
                    cursor: pointer;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}
