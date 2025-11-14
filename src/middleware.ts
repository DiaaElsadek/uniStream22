import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkUser(userToken: string) {
    try {
        const res = await fetch(
            `${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`,
            {
                headers: {
                    apikey: SUPA_SERVICE_KEY,
                    Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
                },
                cache: "no-store",
            }
        );

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) return null;
        return data[0];
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const publicRoutes = ["/login", "/signup", "/"];

    // صفحات عامة (مسموح بالدخول ليها)
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // قراءة userToken من الـ cookies
    const userToken = req.cookies.get("userToken")?.value || null;

    // لو مفيش userToken أصلاً → رجّعه للوجين
    if (!userToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // تحقق من المستخدم
    const user = await checkUser(userToken);

    // لو التوكن قديم أو المستخدم اتحذف
    if (!user) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("userToken", "", { maxAge: -1 });
        return res;
    }

    // لو المستخدم مسجّل دخول وبيحاول يفتح login أو signup
    if (
        user &&
        (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    ) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // حماية صفحات الأدمن
    if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/dashboard/addnews")
    ) {
        if (user.Role !== "admin") {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|/icons|/manifest.json|/sw.js|/api).*)",
    ],
};
