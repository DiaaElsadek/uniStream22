"use client";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/News";
const HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
};

async function handelRole(userToken: string | null): Promise<boolean> {
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, { method: "GET", headers: HEADERS });
        const data = await res.json();
        return "admin" === data[0]?.Role;
    } catch {
        return false;
    }
}

async function handelLogin(userToken: string | null): Promise<boolean> {
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, { method: "GET", headers: HEADERS });
        const data = await res.json();
        return userToken === data[0]?.userToken;
    } catch {
        return false;
    }
}

async function handelSubjects(userToken: string | null): Promise<number[]> {
    if (!userToken) return [];
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, { method: "GET", headers: HEADERS });
        const data = await res.json();
        return data[0]?.subjectsId || [];
    } catch {
        return [];
    }
}

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
    const weekRefs = useRef<Record<number, HTMLElement | null>>({});
    const router = useRouter();

    // ✅ login check + fetch data مع localStorage caching
    useEffect(() => {
        let mounted = true;
        const init = async () => {
            setLoading(true);
            const token = localStorage.getItem("userToken");
            const ok = await handelLogin(token);
            const subj = await handelSubjects(token);
            const role = await handelRole(token);
            setIsAdmin(role);

            if (!ok) {
                router.replace("/login");
                setLoading(false);
                return;
            }

            if (!mounted) return;

            setIsLoggedIn(true);
            setSubjectsId(subj || []);

            // أولاً نعرض الأخبار من الكاش
            const cachedNews = localStorage.getItem("cachedNews");
            if (cachedNews) {
                setNews(JSON.parse(cachedNews));
            }

            // بعدين نعمل fetch لتحديث الأخبار
            try {
                const res = await fetch(API_URL, { headers: HEADERS });
                const data = await res.json();
                const sortedNews = Array.isArray(data)
                    ? data
                        .filter((n) => n && n.week !== undefined && n.week !== null)
                        .sort((a, b) => b.week - a.week)
                    : [];
                setNews(sortedNews);
                localStorage.setItem("cachedNews", JSON.stringify(sortedNews));
            } catch (err) {
                console.error("Error fetching news:", err);
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

    const groupedNews = news.reduce((acc: any, item: any) => {
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

    return (
        <div
            className="login-bg min-h-screen relative text-white"
            style={{
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(100,200,255,0.08), #0f172a)`,
            }}
        >
            {/* Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] z-50 
                    bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl 
                    border border-gray-700/30 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
                    <div
                        className="text-2xl font-bold text-indigo-400 drop-shadow-md cursor-pointer"
                        onClick={() => router.push("/home")}
                    >
                        My College
                    </div>

                    <div className="hidden md:flex gap-6">
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/home")}>
                            Home
                        </button>
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/schedule")}>
                            Table
                        </button>
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/notes")}>
                            Notes
                        </button>
                        {isAdmin && (
                            <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/dashboard/addnews")}>
                                Dashboard
                            </button>
                        )}
                        <button
                            className="nav-btn hover:text-red-400 text-red-400"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button
                            className="text-indigo-400 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="text-2xl transition-transform duration-300"
                            />
                        </button>
                    </div>
                </div>

                <div
                    className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
                        menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col bg-gray-900/95 backdrop-blur-lg rounded-b-2xl p-3 gap-2 border-t border-gray-700/30">
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/home"); setMenuOpen(false); }}>
                            Home
                        </button>
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/schedule"); setMenuOpen(false); }}>
                            Table
                        </button>
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/notes"); setMenuOpen(false); }}>
                            Notes
                        </button>
                        {isAdmin && <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/dashboard/"); setMenuOpen(false); }}>
                            Dashboard
                        </button>}
                        <button className="nav-btn w-full hover:text-red-400 text-left" onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="h-20" />

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-10 drop-shadow-md bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-text text-transparent bg-clip-text">
                    Last News
                </h2>

                {loading ? (
                    <div className="text-center text-gray-400 text-lg animate-pulse">
                        Loading...
                    </div>
                ) : sortedWeeks.length === 0 ? (
                    <div className="text-center text-gray-400 text-lg animate-pulse">
                        No News
                    </div>
                ) : (
                    sortedWeeks.map((week) => {
                        const weekKey = typeof week === "number" ? week : week;
                        const items = groupedNews[weekKey];

                        return (
                            <section
                                key={String(weekKey)}
                                data-week={String(weekKey)}
                                ref={(el) => {
                                    if (el) weekRefs.current[weekKey as number] = el;
                                }}
                                className="mb-14 relative"
                            >
                                <div className="relative flex items-center justify-center my-10 w-full">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            activeWeek === weekKey
                                                ? "bg-gradient-to-r from-indigo-500 to-pink-500 scale-110 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                                                : "bg-gray-600"
                                        } transition-all duration-300`}
                                    />
                                    <div className="flex-1 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-transparent mx-3" />
                                    <span className="text-lg md:text-xl font-semibold text-blue-700 whitespace-nowrap">
                                        Week {weekKey}
                                    </span>
                                    <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-pink-500 mx-3" />
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item: any) => (
                                        <article
                                            key={item.id}
                                            className="group relative overflow-hidden rounded-2xl p-6 bg-gray-800/90 border border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-400/6 to-pink-500/8 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
                                            <div className="relative z-10">
                                                <h3 className="text-2xl font-bold text-indigo-400 mb-3">
                                                    {item.title || "No Title"}
                                                </h3>
                                                <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                                    {item.content || "No Description"}
                                                </p>

                                                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                                                    <span>
                                                        📚 {subjects[item.subjectId - 1] || "غير محدد"}
                                                    </span>
                                                    <span>
                                                        📅{" "}
                                                        {item.createdAt
                                                            ? new Date(item.createdAt).toLocaleDateString(
                                                                "ar-EG"
                                                            )
                                                            : "—"}
                                                    </span>
                                                </div>

                                                <div className="text-sm text-gray-400 mb-5">
                                                    🗓{" "}
                                                    <span className="text-indigo-400 font-semibold">
                                                        Week {item.week ?? "—"}
                                                    </span>
                                                </div>

                                                <div className="text-sm text-gray-400 mb-5">
                                                    Group{" "}
                                                    <span className="text-indigo-400 font-semibold">
                                                        {item.groupId === 0 ? "global" : item.groupId}
                                                    </span>
                                                </div>

                                                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-xl w-full">
                                                    Read More
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </main>

            <div
                className="mouse-circle"
                style={{
                    left: mousePos.x - 10 + "px",
                    top: mousePos.y - 10 + "px",
                }}
            />
        </div>
    );
}
