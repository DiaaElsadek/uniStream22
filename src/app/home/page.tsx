"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch, faStar, faCalendar, faBook, faUsers, faArrowRight } from "@fortawesome/free-solid-svg-icons";

type NewsItem = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    subjectId: number;
    groupId: number;
    week: number;
};

export default function HomePage() {
    const subjects = [
        "معالجة الصور الرقمية",
        "الحوسبة السحابية",
        "التنقيب على البيانات",
        "إتصالات البيانات",
        "مشروع تخرج 1",
    ];

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [subjectsId, setSubjectsId] = useState<number[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [news, setNews] = useState<any[]>([]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeWeek, setActiveWeek] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const weekRefs = useRef<Record<number, HTMLElement | null>>({});
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            setLoading(true);
            const token = localStorage.getItem("userToken");
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await fetch(`/api/home?userToken=${token}`);
                const data = await res.json();

                if (!data.status) {
                    router.replace("/login");
                    setLoading(false);
                    return;
                }

                if (!mounted) return;

                setIsLoggedIn(true);
                setIsAdmin(data.user?.Role === "admin");
                setSubjectsId(data.user?.subjectsId || []);

                const allNews = Array.isArray(data.news)
                    ? data.news
                        .filter(
                            (n: NewsItem) =>
                                n && n.week !== undefined && n.week !== null
                        )
                        .sort((a: NewsItem, b: NewsItem) => b.week - a.week)
                    : [];

                setNews(allNews);
                localStorage.setItem("cachedNews", JSON.stringify(allNews));
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        init();
        return () => {
            mounted = false;
        };
    }, [router]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            const totalHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const pct = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
            setScrollProgress(Math.min(Math.max(pct, 0), 100));

            const scrollY = window.scrollY + window.innerHeight / 2;
            let currentWeek: number | null = null;
            for (const weekKey in weekRefs.current) {
                const section = weekRefs.current[weekKey];
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    const bottom = top + rect.height;
                    if (scrollY >= top && scrollY <= bottom + 100) {
                        currentWeek = Number(weekKey);
                        break;
                    }
                }
            }
            setActiveWeek(currentWeek);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const filteredNews = news.filter((item) => {
        const subjectName = subjects[item.subjectId - 1] || "Global";
        const group = item.groupId?.toString() || "";
        const query = searchQuery.trim().toLowerCase();

        if (!query) return true;

        const normalizedSubject = subjectName.toLowerCase();
        const normalizedGroup = group.toLowerCase();

        return (
            normalizedSubject.includes(query) ||
            normalizedGroup.includes(query) ||
            (query.includes("global") && item.groupId === 0) ||
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.content && item.content.toLowerCase().includes(query))
        );
    });

    const groupedNews = filteredNews.reduce((acc: any, item: any) => {
        const week = item.week ?? "غير محدد";
        if (!acc[week]) acc[week] = [];
        acc[week].push(item);
        return acc;
    }, {} as Record<string | number, any[]>);

    const sortedWeeks = Object.keys(groupedNews)
        .map((k) => (isNaN(Number(k)) ? k : Number(k)))
        .sort((a: any, b: any) =>
            typeof a === "number" && typeof b === "number"
                ? b - a
                : String(b).localeCompare(String(a))
        );

    // Enhanced loading animation
    const LoadingSkeleton = () => (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
                >
                    <motion.div
                        animate={{
                            background: [
                                "linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)",
                                "linear-gradient(90deg, #374151 0%, #6b7280 50%, #374151 100%)",
                                "linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)",
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 bg-[length:200%_100%]"
                    />
                    <div className="relative z-10 space-y-5">
                        <div className="h-7 bg-gray-600 rounded-2xl w-3/4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-600 rounded-xl"></div>
                            <div className="h-4 bg-gray-600 rounded-xl w-5/6"></div>
                            <div className="h-4 bg-gray-600 rounded-xl w-4/6"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-600 rounded-xl w-1/4"></div>
                            <div className="h-4 bg-gray-600 rounded-xl w-1/4"></div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative text-white overflow-hidden">
            {/* Enhanced Light Effect - Upper Center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none overflow-hidden z-0">
                {/* Main Central Light Beam */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl"
                />

                {/* Rotating Color Orbs */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80"
                >
                    <motion.div
                        animate={{
                            x: [-100, 100, -100],
                            y: [-50, 50, -50],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-32 h-32 bg-gradient-to-r from-blue-500/30 to-cyan-500/20 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{
                            x: [100, -100, 100],
                            y: [50, -50, 50],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute w-28 h-28 bg-gradient-to-r from-purple-500/30 to-pink-500/20 rounded-full blur-2xl"
                    />
                </motion.div>

                {/* Pulsing Rings */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 2, 1],
                        opacity: [0.5, 0.8, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 border-2 border-indigo-400/30 rounded-full blur-sm"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.8, 2.2, 1],
                        opacity: [0.3, 0.6, 0.2, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 1
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 border-2 border-purple-400/20 rounded-full blur-sm"
                />

                {/* Floating Light Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -80, 0],
                            x: [0, Math.random() * 60 - 30, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-40 blur-sm"
                        style={{
                            left: `${50 + Math.random() * 40 - 20}%`,
                            top: `${Math.random() * 40}%`,
                        }}
                    />
                ))}

                {/* Shimmer Rays */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: [0, 360],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 20 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5
                        }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
                        style={{
                            transform: `rotate(${i * 45}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Existing Subtle Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5
                    }}
                    className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl"
                />

                {/* Subtle Floating Particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 40 - 20, 0],
                            opacity: [0, 0.4, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 20,
                            repeat: Infinity,
                            delay: i * 1.2,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Responsive Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] z-50 
                    bg-gray-900/95 backdrop-blur-2xl shadow-2xl rounded-3xl 
                    border border-gray-700/60 transition-all duration-500 hover:shadow-3xl"
            >
                <div className="flex justify-between items-center px-4 sm:px-6 py-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl cursor-pointer flex items-center gap-2"
                        onClick={() => router.push("/home")}
                    >
                        UniStream22
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-4 xl:gap-6">
                        {[
                            { name: "Home", path: "/home", icon: faStar },
                            { name: "Table", path: "/schedule", icon: faCalendar },
                            { name: "Notes", path: "/notes", icon: faBook },
                            ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faUsers }] : [])
                        ].map((item, index) => (
                            <motion.button
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -2,
                                    color: "#a78bfa",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold text-sm xl:text-base px-3 xl:px-4 py-2 rounded-xl hover:bg-gray-800/50"
                                onClick={() => router.push(item.path)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-xs xl:text-sm" />
                                {item.name}
                            </motion.button>
                        ))}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{
                                scale: 1.1,
                                y: -2,
                                color: "#f87171",
                                backgroundColor: "rgba(248, 113, 113, 0.1)",
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-all duration-300 font-semibold text-sm xl:text-base px-3 xl:px-4 py-2 rounded-xl"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xs xl:text-sm" />
                            Logout
                        </motion.button>
                    </div>

                    {/* Tablet Navigation (Icons only) */}
                    <div className="hidden md:flex lg:hidden gap-3">
                        {[
                            { name: "Home", path: "/home", icon: faStar },
                            { name: "Table", path: "/schedule", icon: faCalendar },
                            { name: "Notes", path: "/notes", icon: faBook },
                            ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faUsers }] : [])
                        ].map((item, index) => (
                            <motion.button
                                key={item.name}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-indigo-400 transition-all duration-300 rounded-xl hover:bg-gray-800/50"
                                onClick={() => router.push(item.path)}
                                title={item.name}
                            >
                                <FontAwesomeIcon icon={item.icon} />
                            </motion.button>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-10 h-10 text-red-400 hover:text-red-300 transition-all duration-300 rounded-xl hover:bg-red-500/10"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                            title="Logout"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-indigo-400 focus:outline-none p-2 rounded-lg bg-gray-800/50"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="text-xl transition-all duration-300"
                            />
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="md:hidden overflow-hidden border-t border-gray-700/50"
                        >
                            <div className="flex flex-col bg-gray-900/95 backdrop-blur-2xl rounded-b-3xl p-4 gap-2">
                                {[
                                    { name: "Home", path: "/home", icon: faStar },
                                    { name: "Table", path: "/schedule", icon: faCalendar },
                                    { name: "Notes", path: "/notes", icon: faBook },
                                    ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faUsers }] : [])
                                ].map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 10, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                                        className="flex items-center gap-3 w-full text-gray-300 hover:text-indigo-400 text-left transition-all duration-300 py-3 px-4 rounded-xl hover:bg-indigo-500/10"
                                        onClick={() => { router.push(item.path); setMenuOpen(false); }}
                                    >
                                        <FontAwesomeIcon icon={item.icon} />
                                        <span className="font-semibold">{item.name}</span>
                                    </motion.button>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ x: 10, backgroundColor: "rgba(248, 113, 113, 0.1)" }}
                                    className="flex items-center gap-3 w-full text-red-400 hover:text-red-300 text-left transition-all duration-300 py-3 px-4 rounded-xl hover:bg-red-500/10"
                                    onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                    <span className="font-semibold">Logout</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <div className="h-20" />

            {/* Enhanced Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        animate={{
                            backgroundPosition: ["0%", "100%", "0%"],
                            textShadow: [
                                "0 0 20px rgba(99, 102, 241, 0.3)",
                                "0 0 30px rgba(168, 85, 247, 0.5)",
                                "0 0 20px rgba(99, 102, 241, 0.3)",
                            ]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_200%]"
                    >
                        Latest News
                    </motion.h2>

                    {/* Enhanced Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileFocus={{ scale: 1.02 }}
                            className="relative"
                        >
                            <input
                                type="text"
                                placeholder="Search for news, subjects, or groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-3xl bg-gray-800/80 border-2 border-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 outline-none text-white text-base sm:text-lg shadow-2xl placeholder-gray-400 transition-all duration-500 backdrop-blur-xl"
                            />
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-400 text-lg sm:text-xl"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <LoadingSkeleton />
                ) : sortedWeeks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-8xl mb-8"
                        >
                            🔍
                        </motion.div>
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl border border-indigo-500/40 px-8 sm:px-12 py-8 sm:py-10 rounded-3xl shadow-2xl text-center max-w-lg mx-4">
                            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                                No Matching News Found
                            </h3>
                            <p className="text-gray-400 text-lg sm:text-xl">
                                Try searching with different keywords or check your spelling.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    sortedWeeks.map((week, weekIndex) => {
                        const weekKey = typeof week === "number" ? week : week;
                        const items = groupedNews[weekKey];

                        return (
                            <motion.section
                                key={String(weekKey)}
                                initial={{ opacity: 0, y: 80 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: weekIndex * 0.3 }}
                                data-week={String(weekKey)}
                                ref={(el) => {
                                    if (el) weekRefs.current[weekKey as number] = el;
                                }}
                                className="mb-24 relative"
                            >
                                {/* Enhanced Week Header - Clean Design */}
                                <motion.div
                                    className="relative flex items-center justify-center my-16 w-full"
                                    whileInView={{ scale: 1.02 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div
                                        animate={{
                                            scale: activeWeek === weekKey ? [1, 1.3, 1] : 1,
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`w-4 h-4 rounded-full ${activeWeek === weekKey
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50"
                                            : "bg-gray-600"
                                            } transition-all duration-500 z-10`}
                                    />
                                    <motion.div
                                        animate={{
                                            scaleX: activeWeek === weekKey ? [1, 1.2, 1] : 1,
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="flex-1 h-0.5 bg-gradient-to-r from-gray-700 via-gray-600 to-transparent mx-6 rounded-full"
                                    />

                                    {/* Clean Week Title with Animated Gradient Text */}
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="relative"
                                    >
                                        <motion.span
                                            animate={{
                                                backgroundPosition: ["0%", "100%", "0%"],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 to-blue-400 bg-[length:300%_100%] bg-clip-text text-transparent px-2"
                                        >
                                            Week {weekKey}
                                        </motion.span>
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            scaleX: activeWeek === weekKey ? [1, 1.2, 1] : 1,
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-gray-700 mx-6 rounded-full"
                                    />
                                </motion.div>

                                {/* Enhanced News Cards with Beautiful Borders */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {items.map((item: any, index: number) => (
                                        <motion.article
                                            key={item.id}
                                            initial={{ opacity: 0, y: 50, rotateX: 45 }}
                                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.15 }}
                                            whileHover={{
                                                y: -12,
                                                scale: 1.03,
                                                rotateY: 5,
                                                transition: { duration: 0.3 }
                                            }}
                                            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex flex-col perspective-1000 h-full"
                                        >
                                            {/* Beautiful Animated Border */}
                                            <motion.div
                                                animate={{
                                                    opacity: [0.3, 0.7, 0.3],
                                                    background: [
                                                        "linear-gradient(45deg, #4f46e5, #7c3aed, #ec4899, #06b6d4)",
                                                        "linear-gradient(45deg, #06b6d4, #4f46e5, #7c3aed, #ec4899)",
                                                        "linear-gradient(45deg, #ec4899, #06b6d4, #4f46e5, #7c3aed)",
                                                        "linear-gradient(45lez, #7c3aed, #ec4899, #06b6d4, #4f46e5)",
                                                    ]
                                                }}
                                                transition={{
                                                    opacity: { duration: 3, repeat: Infinity },
                                                    background: { duration: 8, repeat: Infinity }
                                                }}
                                                className="absolute inset-0 rounded-3xl p-[3px]"
                                            >
                                                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900"></div>
                                            </motion.div>

                                            {/* Glow Effect */}
                                            <motion.div
                                                animate={{
                                                    opacity: [0.1, 0.3, 0.1],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"
                                            />

                                            <div className="relative z-10 flex flex-col flex-grow p-6 sm:p-8">
                                                {/* Title */}
                                                <motion.h3
                                                    whileHover={{ scale: 1.02 }}
                                                    className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-4 sm:mb-5 text-center leading-tight"
                                                >
                                                    {item.title || "No Title"}
                                                </motion.h3>

                                                {/* Content */}
                                                <p className="text-gray-300 mb-4 sm:mb-6 line-clamp-4 leading-relaxed flex-grow text-right text-sm sm:text-base">
                                                    {item.content || "No Description"}
                                                </p>

                                                {/* Enhanced Metadata */}
                                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
                                                        <span className="text-gray-400 flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm">
                                                            <FontAwesomeIcon icon={faBook} className="text-indigo-400" />
                                                            <span className="font-semibold text-gray-300">Subject:</span>
                                                            <span className="text-indigo-300">{subjects[item.subjectId - 1] || "Global"}</span>
                                                        </span>
                                                        <span className="text-gray-400 flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm">
                                                            <FontAwesomeIcon icon={faCalendar} className="text-purple-400" />
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en") : "—"}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
                                                        <span className="text-gray-400 flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm">
                                                            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                                            <span className="font-semibold text-gray-300">Week:</span>
                                                            <span className="text-purple-300">{item.week ?? "—"}</span>
                                                        </span>
                                                        <span className="text-gray-400 flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm">
                                                            <FontAwesomeIcon icon={faUsers} className="text-green-400" />
                                                            <span className="font-semibold text-gray-300">Group:</span>
                                                            <span className="text-green-300">{item.groupId === 0 ? "global" : item.groupId}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Enhanced Read More Button */}
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.05,
                                                        background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => router.push(`/new/${item.id}`)}
                                                    className="mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl w-full border border-indigo-500/30 flex items-center justify-center gap-2 sm:gap-3 group/btn text-sm sm:text-base"
                                                >
                                                    Read More
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowRight} className="text-xs sm:text-sm group-hover/btn:translate-x-1 transition-transform" />
                                                    </motion.div>
                                                </motion.button>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            </motion.section>
                        );
                    })
                )}
            </main>

            {/* Enhanced Luxury Footer */}
            <footer className="relative z-10 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-32 pb-8 mt-32">
                {/* Footer Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {/* Main Footer Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        {/* Realistic 3D Processor-Style LinkedIn Box */}
                        <motion.div
                            whileHover={{
                                scale: 1.02,
                                y: -5,
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block mb-12 group relative cursor-pointer"
                            onClick={() => window.open('https://www.linkedin.com/in/diaaelsadek', '_blank')}
                        >
                            {/* 3D Base with Realistic Processor Legs */}
                            <div className="relative">
                                {/* Realistic Processor Legs */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-8 z-0">
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -3, 0],
                                                opacity: [0.6, 0.9, 0.6],
                                            }}
                                            transition={{
                                                duration: 2 + i * 0.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.2
                                            }}
                                            className="w-4 h-8 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-800 rounded-t-lg relative border border-gray-500/30"
                                        >
                                            {/* Leg Contacts */}
                                            <div className="absolute -bottom-1 left-0 w-full h-2 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-lg border-t border-gray-400/20" />

                                            {/* Leg Glow */}
                                            <motion.div
                                                animate={{
                                                    opacity: [0.3, 0.7, 0.3],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: i * 0.3
                                                }}
                                                className="absolute -bottom-1 left-0 w-full h-2 bg-blue-400/30 blur-sm rounded-full"
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Main 3D Processor Container */}
                                <motion.div
                                    className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 px-12 sm:px-16 py-10 sm:py-12 rounded-2xl shadow-2xl backdrop-blur-xl border border-gray-600/50 group-hover:border-gray-500/70 transition-all duration-500 overflow-hidden transform-gpu"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px'
                                    }}
                                >
                                    {/* 3D Depth Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-gray-700/30 to-transparent rounded-2xl transform-gpu"
                                        style={{ transform: 'translateZ(-10px)' }} />

                                    {/* Processor Top Heat Spreader */}
                                    <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-gray-700/80 to-gray-900/90 border border-gray-600/30" />

                                    {/* Electric Circuit Border */}
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                        {/* Base Border */}
                                        <motion.div
                                            animate={{
                                                opacity: [0.4, 0.8, 0.4],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-0.5"
                                        />

                                        {/* Animated Circuit Lines */}
                                        <motion.div
                                            animate={{
                                                x: [-200, 400],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            className="absolute top-2 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm"
                                        />
                                        <motion.div
                                            animate={{
                                                x: [400, -200],
                                            }}
                                            transition={{
                                                duration: 3.5,
                                                repeat: Infinity,
                                                ease: "linear",
                                                delay: 1
                                            }}
                                            className="absolute bottom-2 left-0 w-28 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent blur-sm"
                                        />
                                    </div>

                                    {/* Processor Corner Pins */}
                                    <div className="absolute -top-1 -left-1 w-4 h-4">
                                        <motion.div
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.8, 1.2, 0.8],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="w-full h-full bg-cyan-400 rounded-full blur-sm"
                                        />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4">
                                        <motion.div
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.8, 1.2, 0.8],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 0.5
                                            }}
                                            className="w-full h-full bg-purple-400 rounded-full blur-sm"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4">
                                        <motion.div
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.8, 1.2, 0.8],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1
                                            }}
                                            className="w-full h-full bg-blue-400 rounded-full blur-sm"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4">
                                        <motion.div
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.8, 1.2, 0.8],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1.5
                                            }}
                                            className="w-full h-full bg-cyan-400 rounded-full blur-sm"
                                        />
                                    </div>

                                    {/* Overheating Effect */}
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                        <motion.div
                                            animate={{
                                                background: [
                                                    "linear-gradient(45deg, rgba(255, 107, 0, 0.1), rgba(255, 140, 0, 0.05), rgba(255, 107, 0, 0.1))",
                                                    "linear-gradient(45deg, rgba(255, 140, 0, 0.15), rgba(255, 107, 0, 0.08), rgba(255, 140, 0, 0.15))",
                                                    "linear-gradient(45deg, rgba(255, 107, 0, 0.1), rgba(255, 140, 0, 0.05), rgba(255, 107, 0, 0.1))",
                                                ]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 opacity-30"
                                        />
                                    </div>

                                    {/* Grid Pattern Background */}
                                    <div className="absolute inset-0 opacity-[0.15]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/30" />
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,rgba(120,119,198,0.4)_49%,rgba(120,119,198,0.4)_51%,transparent_52%)] bg-[length:25px_25px]" />
                                        <div className="absolute inset-0 bg-[linear-gradient(transparent_48%,rgba(120,119,198,0.4)_49%,rgba(120,119,198,0.4)_51%,transparent_52%)] bg-[length:25px_25px]" />
                                    </div>

                                    {/* Hover Heat Wave Effect */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-red-500/10 to-orange-500/20 blur-xl"
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-8 transform-gpu"
                                        style={{ transform: 'translateZ(20px)' }}>

                                        {/* LinkedIn Icon Container - Enhanced 3D Effect */}
                                        <motion.div
                                            whileHover={{
                                                scale: 1.15,
                                                rotateY: 10,
                                                transition: { duration: 0.4 }
                                            }}
                                            className="relative"
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Icon Background Glow */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.3, 0.7, 0.3],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-2xl"
                                            />

                                            {/* 3D Icon Platform */}
                                            <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-2xl border border-gray-600/50 shadow-2xl transform-gpu"
                                                style={{
                                                    transform: 'translateZ(30px)',
                                                    boxShadow: '0 10px 30px rgba(0, 119, 181, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                                                }}>

                                                {/* FontAwesome LinkedIn Icon - Fixed */}
                                                <div className="relative z-10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className="text-white drop-shadow-lg">
                                                        <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                </div>

                                                {/* Icon Reflection */}
                                                <div className="absolute bottom-1 left-1 right-1 h-2 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-sm" />
                                            </div>

                                            {/* Floating Heat Particles */}
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        y: [0, -15, 0],
                                                        x: [0, Math.random() * 10 - 5, 0],
                                                        opacity: [0, 0.8, 0],
                                                        scale: [0, 1, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2 + i * 0.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.3,
                                                        ease: "easeInOut"
                                                    }}
                                                    className={`absolute w-2 h-2 rounded-full blur-sm ${i % 2 === 0 ? 'bg-orange-400' : 'bg-red-400'}`}
                                                    style={{
                                                        left: `${20 + i * 12}%`,
                                                        top: '-10px',
                                                    }}
                                                />
                                            ))}
                                        </motion.div>

                                        {/* Text Content */}
                                        <div className="text-center space-y-3">
                                            <motion.h3
                                                animate={{
                                                    backgroundPosition: ["0%", "100%", "0%"],
                                                    textShadow: [
                                                        "0 0 20px rgba(0, 119, 181, 0.5)",
                                                        "0 0 30px rgba(0, 119, 181, 0.8)",
                                                        "0 0 20px rgba(0, 119, 181, 0.5)",
                                                    ]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-200 via-blue-300 to-cyan-300 bg-[length:200%_100%] bg-clip-text text-transparent"
                                            >
                                                Connect on LinkedIn
                                            </motion.h3>
                                            <motion.p
                                                initial={{ opacity: 0.7 }}
                                                whileHover={{ opacity: 1 }}
                                                className="text-base text-gray-300 font-medium transition-opacity duration-300 tracking-wide"
                                            >
                                                Diaa Elsadek - Fullstack Web Developer
                                            </motion.p>
                                        </div>
                                    </div>

                                    {/* Processor Heat Vents */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    opacity: [0.3, 0.8, 0.3],
                                                    scaleY: [1, 1.2, 1],
                                                }}
                                                transition={{
                                                    duration: 1.5 + i * 0.2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: i * 0.1
                                                }}
                                                className="w-1 h-3 bg-gradient-to-t from-orange-400 to-red-500 rounded-full"
                                            />
                                        ))}
                                    </div>

                                    {/* Processor Text Label */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2">
                                        <motion.p
                                            animate={{
                                                opacity: [0.5, 0.8, 0.5],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="text-xs text-gray-400 font-mono tracking-widest"
                                        >
                                            LINKEDIN
                                        </motion.p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Ground Shadow */}
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-blue-500/20 blur-xl rounded-full"
                            />
                        </motion.div>

                        {/* Copyright Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-16"
                        >
                            <motion.p
                                animate={{
                                    backgroundPosition: ["0%", "100%", "0%"],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-300 via-blue-300 to-purple-300 bg-[length:200%_100%] bg-clip-text text-transparent mb-3"
                            >
                                © {new Date().getFullYear()} Diaa Elsadek
                            </motion.p>
                        </motion.div>

                        {/* Tech-inspired Decorative Elements */}
                        <motion.div
                            className="flex justify-center items-center gap-6 mt-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.9 }}
                        >
                            {[...Array(7)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.3, 0.8, 0.3],
                                        y: [0, -2, 0],
                                    }}
                                    transition={{
                                        duration: 2 + i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.15
                                    }}
                                    className={`w-1.5 h-1.5 rounded-full ${i % 4 === 0 ? 'bg-cyan-400' :
                                        i % 4 === 1 ? 'bg-blue-400' :
                                            i % 4 === 2 ? 'bg-purple-400' : 'bg-gray-400'}`}
                                />
                            ))}
                        </motion.div>

                        {/* Circuit Board Line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            className="mt-10 mx-auto w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full relative"
                        >
                            <motion.div
                                animate={{
                                    x: [-20, 220],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute w-2 h-0.5 bg-cyan-300 rounded-full blur-sm"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}