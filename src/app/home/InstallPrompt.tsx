"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iOS = /iphone|ipad|ipod/.test(userAgent);
        const standalone = (window.navigator as any).standalone === true;

        if (iOS && !standalone) {
            setIsIOS(true);
            setShowInstallBox(true);
            return;
        }

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
        setDeferredPrompt(null);
        setShowInstallBox(false);
    };

    if (!showInstallBox) return null;

    return (
        <div className="install-box">
            <div className="gradient-border"></div>
            <div className="install-content">
                {isIOS ? (
                    <p>📱 Tap <b>Share</b> → <b>Add to Home Screen</b> to install the app.</p>
                ) : (
                    <>
                        <p>📱 Install the app for a faster and smoother experience!</p>
                        <button onClick={handleInstallClick}>Install</button>
                    </>
                )}
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(20, 20, 30, 0.9);
                    border-radius: 1.5rem;
                    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
                    padding: 15px 25px;
                    z-index: 1000;
                    color: #e5e7eb;
                    font-weight: 500;
                    overflow: hidden;
                    animation: fadeIn 0.6s ease-out;
                    max-width: 280px;
                }

                .gradient-border {
                    position: absolute;
                    inset: 0;
                    padding: 2px;
                    border-radius: 1.5rem;
                    background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffcc, #ffcc00);
                    background-size: 600% 600%;
                    animation: gradientMove 6s ease infinite;
                    z-index: 1;
                }

                .install-content {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                button {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    padding: 6px 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
                }

                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(-15px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
        </div>
    );
}
