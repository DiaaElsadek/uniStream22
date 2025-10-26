"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// تنظيف لأي كود HTML أو جافاسكريبت
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").replace(/script/gi, "").trim();
}

// يسمح فقط بحروف (عربي أو إنجليزي) وأرقام وسبيس
function sanitizeFullName(input: string): string {
  return input.replace(/[^A-Za-z0-9\u0600-\u06FF\s]/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const { academicId, email, password, fullName, userToken } = await req.json();

    // ===== VALIDATION SECTION =====
    if (!academicId || !email || !password || !fullName || !userToken) {
      return NextResponse.json(
        { message: "All fields are required.", status: false, type: "validation" },
        { status: 400 }
      );
    }

    // تنظيف كل القيم
    const cleanAcademicId = sanitizeInput(academicId);
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    const cleanFullName = sanitizeFullName(fullName); // يمنع الرموز الخاصة
    const cleanUserToken = sanitizeInput(userToken);

    // تحقق من أن الرقم الأكاديمي 8 أرقام فقط
    if (!/^4202[234]\d{3}$/.test(cleanAcademicId)) {
      return NextResponse.json(
        { message: "Academic ID must be exactly 8 digits.", status: false, type: "academicId" },
        { status: 400 }
      );
    }

    // السماح فقط بحروف وأرقام و @ و . في الايميل
    const emailRegex = /^[A-Za-z0-9@.]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { message: "Email can only contain letters, numbers, '@', and '.'", status: false, type: "email" },
        { status: 400 }
      );
    }

    // الباسورد يجب أن يكون 8 فقط
    if (cleanPassword.length !== 8) {
      return NextResponse.json(
        { message: "Password must be exactly 8 characters long.", status: false, type: "password" },
        { status: 400 }
      );
    }

    // الاسم لا يقل عن 3 وأقل من أو يساوي 20 وحروف/أرقام/سبيس فقط
    if (cleanFullName.length < 3) {
      return NextResponse.json(
        { message: "Full name must be at least 3 characters long.", status: false, type: "fullName" },
        { status: 400 }
      );
    }
    if (cleanFullName.length > 20) {
      return NextResponse.json(
        { message: "Full name must be at most 20 characters.", status: false, type: "fullName" },
        { status: 400 }
      );
    }

    // إذا اتمسح أو تغير فيه أي جزء غير مسموح بيرجع رسالة
    if (cleanFullName !== fullName.trim()) {
      return NextResponse.json(
        { message: "Full name must only contain letters, numbers and spaces.", status: false, type: "fullName" },
        { status: 400 }
      );
    }

    // ===== CHECK DUPLICATES =====
    const resAcad = await fetch(`${SUPA_URL}/rest/v1/AppUser?AcademicId=eq.${cleanAcademicId}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });
    const dataAcad = await resAcad.json();
    if (Array.isArray(dataAcad) && dataAcad.length > 0) {
      return NextResponse.json(
        { message: "This Academic ID is already registered.", status: false, type: "academicId" },
        { status: 400 }
      );
    }

    const resEmail = await fetch(`${SUPA_URL}/rest/v1/AppUser?email=eq.${cleanEmail}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });
    const dataEmail = await resEmail.json();
    if (Array.isArray(dataEmail) && dataEmail.length > 0) {
      return NextResponse.json(
        { message: "This email is already registered.", status: false, type: "email" },
        { status: 400 }
      );
    }

    // ===== INSERT NEW USER =====
    const insertRes = await fetch(`${SUPA_URL}/rest/v1/AppUser`, {
      method: "POST",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        AcademicId: cleanAcademicId,
        email: cleanEmail,
        password: cleanPassword,
        fullName: cleanFullName,
        userToken: cleanUserToken,
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("Insert error:", errText);
      return NextResponse.json(
        { message: "Failed to register user.", status: false, type: "server" },
        { status: 500 }
      );
    }

    const user = await insertRes.json();

    // تسجيل الكوكيز بأمان
    (await cookies()).set("userToken", cleanUserToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({
      message: "Registered successfully!",
      status: true,
      type: "success",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Internal server error.", status: false, type: "error" },
      { status: 500 }
    );
  }
}
