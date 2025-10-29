"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle({ onThemeChange }: { onThemeChange?: (isDark: boolean) => void }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => setMounted(true), []);
    
    const toggleTheme = async () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        const newTheme = theme === "dark" ? "light" : "dark";
        
        // Add a small delay for better animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setTheme(newTheme);
        if (onThemeChange) {
            onThemeChange(newTheme === "dark");
        }
        
        setIsAnimating(false);
    };

    if (!mounted) return (
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );

    return (
        <motion.button
            onClick={toggleTheme}
            className="group relative p-3 rounded-2xl transition-all duration-500 
                bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
                border-2 border-gray-200/60 dark:border-gray-700/60 
                hover:shadow-2xl hover:shadow-yellow-500/25 dark:hover:shadow-blue-500/25
                hover:border-yellow-400/30 dark:hover:border-blue-400/30
                backdrop-blur-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
        >
            {/* Animated orb background */}
            <motion.div
                className={`absolute inset-1 rounded-xl ${
                    theme === "dark" 
                        ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20" 
                        : "bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
                }`}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating particles */}
            <AnimatePresence>
                {theme === "dark" && (
                    <>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    x: Math.cos(i * 120) * 10,
                                    y: Math.sin(i * 120) * 10,
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Main icon container */}
            <div className="relative z-10 w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        rotate: theme === "dark" ? 0 : 360,
                        scale: theme === "dark" ? 1 : 1.2,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: "easeInOut"
                    }}
                >
                    <FontAwesomeIcon 
                        icon={theme === "dark" ? faMoon : faSun}
                        className={`${
                            theme === "dark" 
                                ? "text-blue-300 drop-shadow-lg" 
                                : "text-yellow-500 drop-shadow-lg"
                        } transition-colors duration-500`}
                        size="lg"
                    />
                </motion.div>
            </div>

            {/* Pulse ring effect */}
            <motion.div
                className={`absolute inset-0 rounded-2xl border-2 ${
                    theme === "dark" 
                        ? "border-blue-400/30" 
                        : "border-yellow-400/30"
                }`}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Enhanced tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-2 
                bg-gray-900/95 dark:bg-gray-100/95 
                text-white dark:text-gray-900 
                text-xs font-semibold rounded-lg 
                opacity-0 group-hover:opacity-100 
                transition-all duration-300 
                pointer-events-none 
                backdrop-blur-sm
                border border-gray-700 dark:border-gray-300">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 
                    bg-gray-900/95 dark:bg-gray-100/95 
                    rotate-45 
                    border-r border-b border-gray-700 dark:border-gray-300"></div>
            </div>
        </motion.button>
    );
}