"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faEdit, faCalendarAlt, faBook, faHome, faSignOutAlt, faDashboard, faClock, faMapMarkerAlt, faUsers, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

type ScheduleItem = {
    id: number;
    subjectId: number;
    groupId?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    location?: string | null;
    description?: string | null;
    day?: string | null;
};

export default function SchedulePage() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scheduleByDay, setScheduleByDay] = useState<Record<string, ScheduleItem[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        checkTheme();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    checkTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const academicId = localStorage.getItem("academicId");
                const userToken = localStorage.getItem("userToken");
                if (!academicId) {
                    router.replace("/login");
                    return;
                }

                const cached = localStorage.getItem("cachedSchedule");
                if (cached) {
                    setScheduleByDay(JSON.parse(cached));
                    setLoading(false);
                }

                const url = `/api/schedule?academicId=${encodeURIComponent(academicId)}&userToken=${encodeURIComponent(userToken ?? "")}`;
                const res = await fetch(url);
                const data = await res.json();

                if (res.status !== 200) throw new Error(data.message || "Failed to fetch schedule");

                setScheduleByDay(data.scheduleByDay || {});
                setIsAdmin(data.isAdmin || false);
                localStorage.setItem("cachedSchedule", JSON.stringify(data.scheduleByDay || {}));
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err?.message || "Unknown error");
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const WEEK_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const subjects_name = ["معالجة الصور الرقمية", "الحوسبة السحابية", "التنقيب على البيانات", "إتصالات البيانات", "مشروع تخرج 1"];
    const startTimes = ["9:00", "9:45", "10:40", "11:25", "12:20", "1:05", "2:00", "2:45"];
    const todayIndex = (new Date().getDay() + 1) % 7;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) window.location.reload();
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    // Premium color schemes with enhanced gradients
    const dayGradients = [
        "from-purple-500/20 via-violet-500/15 to-fuchsia-500/20",
        "from-blue-500/20 via-sky-500/15 to-cyan-500/20",
        "from-emerald-500/20 via-teal-500/15 to-green-500/20",
        "from-amber-500/20 via-orange-500/15 to-yellow-500/20",
        "from-indigo-500/20 via-purple-500/15 to-pink-500/20",
        "from-rose-500/20 via-pink-500/15 to-red-500/20",
        "from-slate-500/20 via-gray-500/15 to-zinc-500/20"
    ];

    const subjectColors = [
        "bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-l-4 border-purple-400 shadow-lg shadow-purple-500/10",
        "bg-gradient-to-br from-blue-500/20 to-sky-600/20 border-l-4 border-blue-400 shadow-lg shadow-blue-500/10",
        "bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-l-4 border-emerald-400 shadow-lg shadow-emerald-500/10",
        "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-l-4 border-amber-400 shadow-lg shadow-amber-500/10",
        "bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-l-4 border-indigo-400 shadow-lg shadow-indigo-500/10"
    ];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${isDarkMode 
            ? 'from-gray-950 via-slate-900 to-gray-950' 
            : 'from-blue-50 via-slate-100 to-indigo-50'} relative overflow-hidden`}>
            
            {/* Premium Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Gradient Mesh */}
                <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isDarkMode 
                    ? 'from-purple-900/20 via-transparent to-blue-900/20' 
                    : 'from-purple-200/20 via-transparent to-blue-200/20'}`}></div>
                
                {/* Floating Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 120, 0],
                        y: [0, -80, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`absolute top-20 left-20 w-80 h-80 ${isDarkMode 
                        ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' 
                        : 'bg-gradient-to-r from-violet-400/15 to-fuchsia-400/15'} rounded-full blur-3xl`}
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.4, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                    }}
                    className={`absolute bottom-20 right-20 w-96 h-96 ${isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600/10 to-cyan-600/10' 
                        : 'bg-gradient-to-r from-blue-400/15 to-cyan-400/15'} rounded-full blur-3xl`}
                />

                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className={`absolute inset-0 bg-[linear-gradient(90deg,_transparent_95%,_rgba(255,255,255,0.1)_100%)] bg-[length:50px_50px] animate-[gridMove_20s_linear_infinite] ${isDarkMode ? '' : 'invert'}`}></div>
                    <div className={`absolute inset-0 bg-[linear-gradient(180deg,_transparent_95%,_rgba(255,255,255,0.1)_100%)] bg-[length:50px_50px] animate-[gridMove_15s_linear_infinite_reverse] ${isDarkMode ? '' : 'invert'}`}></div>
                </div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -150, 0],
                            x: [0, Math.random() * 80 - 40, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.8, 0],
                            rotate: [0, 270, 360],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 25,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                        }}
                        className={`absolute w-2 h-2 ${isDarkMode 
                            ? 'bg-gradient-to-r from-violet-400 to-blue-400' 
                            : 'bg-gradient-to-r from-violet-500 to-blue-500'} rounded-full opacity-60`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Premium Navigation */}
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] z-50 
                    ${isDarkMode 
                        ? 'bg-slate-900/90 backdrop-blur-3xl shadow-2xl border border-slate-700/40 hover:border-slate-600/60' 
                        : 'bg-white/90 backdrop-blur-3xl shadow-2xl border border-slate-200/40 hover:border-slate-300/60'} 
                    rounded-3xl transition-all duration-500 hover:shadow-3xl`}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-3xl font-black bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl cursor-pointer flex items-center gap-3"
                        onClick={() => router.push("/home")}
                    >
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl"
                        >
                            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
                        </motion.div>
                        UniStream22
                    </motion.div>

                    <div className="hidden md:flex gap-6">
                        {[
                            { name: "Home", path: "/home", icon: faHome },
                            { name: "Table", path: "/schedule", icon: faCalendarAlt },
                            { name: "Notes", path: "/notes", icon: faBook },
                            ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faDashboard }] : [])
                        ].map((item, index) => (
                            <motion.button
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                                whileHover={{ 
                                    scale: 1.1, 
                                    y: -3,
                                    background: isDarkMode 
                                        ? "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))"
                                        : "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-3 ${isDarkMode 
                                    ? 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-blue-500/10' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-violet-500/5 hover:to-blue-500/5'} transition-all duration-300 font-semibold text-base px-5 py-3 rounded-2xl border border-transparent ${isDarkMode 
                                    ? 'hover:border-slate-600/30' 
                                    : 'hover:border-slate-300/30'}`}
                                onClick={() => router.push(item.path)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-sm" />
                                {item.name}
                            </motion.button>
                        ))}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, type: "spring" }}
                            whileHover={{ 
                                scale: 1.1, 
                                y: -3,
                                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))",
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-300 font-semibold text-base px-5 py-3 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                            Logout
                        </motion.button>
                    </div>

                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${isDarkMode 
                                ? 'text-violet-400 bg-slate-800/50 border border-slate-700/40' 
                                : 'text-violet-500 bg-white/50 border border-slate-300/40'} focus:outline-none p-3 rounded-xl`}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="text-xl transition-all duration-300"
                            />
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className={`md:hidden overflow-hidden border-t ${isDarkMode 
                                ? 'border-slate-700/40' 
                                : 'border-slate-200/40'}`}
                        >
                            <div className={`flex flex-col ${isDarkMode 
                                ? 'bg-slate-900/95' 
                                : 'bg-white/95'} backdrop-blur-3xl rounded-b-3xl p-4 gap-2`}>
                                {[
                                    { name: "Home", path: "/home", icon: faHome },
                                    { name: "Table", path: "/schedule", icon: faCalendarAlt },
                                    { name: "Notes", path: "/notes", icon: faBook },
                                    ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faDashboard }] : [])
                                ].map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ 
                                            x: 10, 
                                            background: isDarkMode 
                                                ? "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))"
                                                : "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))" 
                                        }}
                                        className={`flex items-center gap-3 w-full ${isDarkMode 
                                            ? 'text-slate-300 hover:text-white' 
                                            : 'text-slate-600 hover:text-slate-900'} text-left transition-all duration-300 py-4 px-4 rounded-xl ${isDarkMode 
                                            ? 'hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-blue-500/10' 
                                            : 'hover:bg-gradient-to-r hover:from-violet-500/5 hover:to-blue-500/5'}`}
                                        onClick={() => { router.push(item.path); setMenuOpen(false); }}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                                        <span className="font-semibold">{item.name}</span>
                                    </motion.button>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ x: 10, background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))" }}
                                    className="flex items-center gap-3 w-full text-red-400 hover:text-red-300 text-left transition-all duration-300 py-4 px-4 rounded-xl hover:bg-red-500/10"
                                    onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                                    <span className="font-semibold">Logout</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <div className="h-28" />

            {/* Premium Main Content */}
            <main className="max-w-8xl mx-auto px-4 py-12 relative z-10">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-20"
                >
                    <motion.h1
                        animate={{
                            backgroundPosition: ["0%", "100%", "0%"],
                            textShadow: [
                                "0 0 30px rgba(139, 92, 246, 0.4)",
                                "0 0 40px rgba(59, 130, 246, 0.6)",
                                "0 0 30px rgba(139, 92, 246, 0.4)",
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-6xl md:text-7xl font-black bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent bg-[length:300%_300%] mb-6"
                    >
                        Weekly Schedule
                    </motion.h1>
                    
                    {/* Current Time Display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className={`mt-8 inline-block ${isDarkMode 
                            ? 'bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/40' 
                            : 'bg-gradient-to-r from-white/60 to-slate-100/60 border border-slate-300/40'} backdrop-blur-sm rounded-2xl px-6 py-3`}
                    >
                        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            <FontAwesomeIcon icon={faClock} className="text-blue-400" />
                            <span className="font-mono text-lg">{currentTime.toLocaleTimeString()}</span>
                        </div>
                    </motion.div>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-4 border-violet-500/30 border-t-violet-500 rounded-full mx-auto mb-6"
                            />
                            <motion.h2
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
                            >
                                Loading your schedule...
                            </motion.h2>
                        </motion.div>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center ${isDarkMode 
                            ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20' 
                            : 'bg-gradient-to-r from-red-500/5 to-pink-500/5 border border-red-500/10'} p-10 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto`}
                    >
                        <div className="text-5xl mb-6">🚨</div>
                        <h3 className="text-3xl font-bold text-red-400 mb-4">Schedule Loading Error</h3>
                        <p className={`text-lg ${isDarkMode ? 'text-red-300/80' : 'text-red-600/80'}`}>{error}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4"
                    >
                        {WEEK_DAYS.map((day, dayIndex) => (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: dayIndex * 0.15,
                                    type: "spring",
                                    stiffness: 80
                                }}
                                whileHover={{ 
                                    scale: 1.03, 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                className={`relative group ${day === WEEK_DAYS[todayIndex] ? "ring-4 ring-cyan-500/60 shadow-2xl" : ""}`}
                            >
                                {/* Enhanced Glow Effect */}
                                <motion.div
                                    animate={{
                                        opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${dayGradients[dayIndex]} blur-2xl group-hover:blur-3xl transition-all duration-700`}
                                />

                                <div className={`relative ${isDarkMode 
                                    ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/40' 
                                    : 'bg-gradient-to-br from-white/80 to-slate-100/80 border border-slate-300/40'} backdrop-blur-3xl rounded-3xl p-7 shadow-2xl hover:shadow-4xl transition-all duration-500 h-full overflow-hidden ${dayGradients[dayIndex].replace('20', '15')}`}>
                                    
                                    {/* Day Header */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center mb-8"
                                    >
                                        <h2 className={`text-2xl font-black ${
                                            day === WEEK_DAYS[todayIndex] 
                                                ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" 
                                                : isDarkMode 
                                                ? "text-slate-100" 
                                                : "text-slate-800"
                                        }`}>
                                            {day}
                                            {day === WEEK_DAYS[todayIndex] && (
                                                <motion.span
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="ml-3 text-cyan-400 text-2xl"
                                                >
                                                    ✨
                                                </motion.span>
                                            )}
                                        </h2>
                                    </motion.div>

                                    {/* Schedule Items */}
                                    <div className="space-y-5">
                                        {scheduleByDay[day] && scheduleByDay[day].length > 0 ? (
                                            scheduleByDay[day]
                                                .sort((a, b) => {
                                                    const indexA = startTimes.indexOf(a.startTime ?? "");
                                                    const indexB = startTimes.indexOf(b.startTime ?? "");
                                                    return indexA - indexB;
                                                })
                                                .map((lec, lecIndex) => (
                                                    <motion.div
                                                        key={lec.id}
                                                        initial={{ opacity: 0, x: -30 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + lecIndex * 0.15 }}
                                                        whileHover={{ scale: 1.08, x: 8 }}
                                                        className={`p-5 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu ${
                                                            subjectColors[lec.subjectId - 1] || subjectColors[0]
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className={`font-bold text-lg leading-tight flex-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                                                {subjects_name[lec.subjectId - 1] ?? `Subject ${lec.subjectId}`}
                                                            </h3>
                                                        </div>
                                                        
                                                        <div className="space-y-3 text-sm">
                                                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-blue-400" />
                                                                </div>
                                                                <span className="font-semibold">{lec.startTime ?? "-"} - {lec.endTime ?? "-"}</span>
                                                            </div>
                                                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 text-green-400" />
                                                                </div>
                                                                <span>Room: {lec.location ?? "-"}</span>
                                                            </div>
                                                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                                                    <FontAwesomeIcon icon={faUsers} className="w-3 h-3 text-purple-400" />
                                                                </div>
                                                                <span>Group: {lec.groupId ?? "-"}</span>
                                                            </div>
                                                            {lec.description && (
                                                                <p className={`text-xs mt-3 leading-relaxed ${isDarkMode 
                                                                    ? 'text-slate-400 bg-slate-800/30' 
                                                                    : 'text-slate-600 bg-slate-200/50'} p-3 rounded-xl`}>
                                                                    {lec.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-12"
                                            >
                                                <div className="text-5xl mb-4">🎯</div>
                                                <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No classes scheduled</p>
                                                <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Enjoy your free time!</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            {/* Premium Edit Schedule Button */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center mt-20 mb-16 relative z-10"
            >
                <motion.button
                    onClick={() => router.push("/selectschedule")}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileHover={{ 
                        scale: 1.08, 
                        y: -4,
                        background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
                        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden group px-16 py-6 rounded-3xl font-black text-xl transition-all duration-500 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white shadow-3xl hover:shadow-4xl border border-violet-400/30"
                >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <FontAwesomeIcon icon={faEdit} className="w-6 h-6" />
                        </motion.div>
                        Edit My Schedule
                    </span>
                    
                    {/* Enhanced Button Shine Effect */}
                    {isHovered && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
                        />
                    )}

                    {/* Pulse Effect */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-600/30 via-blue-600/30 to-cyan-600/30"
                    />

                    {/* Border Glow */}
                    <motion.div
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 blur-sm -z-10"
                    />
                </motion.button>
            </motion.div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes gridMove {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(-50px) translateY(-50px); }
                }
            `}</style>
        </div>
    );
}