"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from "next/link";
import { useRouter } from 'next/navigation';

type SignupResponse = {
    message: string;
    status: boolean;
    type: string;
};

async function handelLogin(email: string, password: string): Promise<SignupResponse> {
    try {
        // ابحث عن المستخدم بحسب الايميل فقط، وبعدين أكد الباسورد محليًا
        const encodedEmail = encodeURIComponent(email);
        const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser?email=eq.${encodedEmail}`;

        // console.log("Fetching URL:", url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        if (!res.ok) {
            console.error("Fetch error, status:", res.status);
            return { message: "Server error", status: false, type: "server_error" };
        }

        const data = await res.json();
        // console.log("data array:", data);

        if (!Array.isArray(data) || data.length === 0) {
            return { message: "User not found", status: false, type: "not_found" };
        }

        const user = data[0];
        // console.log("fetched user:", user);

        // قارن الباسورد (لو عندك هاش استخدم مقارنة مناسبة على السيرفر)
        if (password === user.password) {
            // خزّن بيانات آمنة فقط (مثال: role في كوكي، وإيميل في localStorage)
            try {
                // ضع الـ role كوكي بسيطة (لو محتاج httpOnly لازم تعملها من السيرفر)
                document.cookie = `role=${encodeURIComponent(user.role ?? "")}; path=/;`;
            } catch (e) {
                console.warn("Cookie set failed:", e);
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("academicId", user?.AcademicId ?? "");
            localStorage.setItem("email", user?.email ?? "");
            localStorage.setItem("fullName", user?.fullName ?? "");
            localStorage.setItem("userToken", user?.userToken ?? "");

            return { message: "Login successful", status: true, type: "success" };
        } else {
            return { message: "Invalid email or password", status: false, type: "credentials" };
        }
    } catch (err) {
        console.error("handelLogin error:", err);
        return { message: "Unexpected error", status: false, type: "error" };
    }
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, seterror] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // نملأ الايميل لو محفوظ محليًا (لا نخزن الباسورد للآمان)
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail") || localStorage.getItem("email");
        if (savedEmail) setEmail(savedEmail);
        // لا نخزن الباسورد في localStorage لأسباب أمنية — خليه للبراوزر password manager
    }, []);

    // live validation
    const onEmailChange = (value: string) => {
        setEmail(value);
        if (value.length === 0) {
            setEmailError("Email is required.");
        } else if (!emailRegex.test(value)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError(null);
        }
    };

    const onEmailBlur = () => {
        if (email.length === 0) {
            setEmailError("Email is required.");
        } else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError(null);
        }
    };

    const onPasswordChange = (value: string) => {
        setPassword(value);
        if (value.length === 0) {
            setPasswordError("Password is required.");
        } else if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else {
            setPasswordError(null);
        }
    };

    const onPasswordBlur = () => {
        if (password.length === 0) {
            setPasswordError("Password is required.");
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else {
            setPasswordError(null);
        }
    };

    const formValid = !emailError && !passwordError && email.length > 0 && password.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid) return;

        setLoading(true);
        seterror(null);

        try {
            const res = await handelLogin(email.trim(), password);
            // console.log("login response:", res);

            if (res.status) {
                // حفظ الايميل للسهولة (مش الباسورد)
                localStorage.setItem("savedEmail", email.trim());

                alert("Logged in successfully!");
                router.push("/home");
            } else {
                seterror(res.message);
            }
        } catch (err) {
            console.error("submit error:", err);
            seterror("Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    // Hot Reload
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem("hasReloadedLogin");
    
        if (!hasReloaded) {
          sessionStorage.setItem("hasReloadedLogin", "true");
          window.location.reload();
        }
      }, []);

    return (
        <div className="login-bg min-h-screen flex items-center justify-center px-4">
            <div className="login-container relative max-w-md w-full p-8 sm:p-12">
                <div className="gradient-border mb-7"></div>

                <h1 className="text-3xl font-bold text-white mb-2 text-center relative z-10">
                    Welcome Back
                </h1>
                <p className="text-gray-300 text-center mb-8 relative z-10">
                    Sign in to your account
                </p>

                <div className="gradient-border mb-4"></div>

                <form
                    onSubmit={handleSubmit}
                    method="POST"
                    autoComplete="on"
                    className="space-y-6 relative z-10"
                    noValidate
                >
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-200 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            onBlur={onEmailBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:border-indigo-400 transition ${emailError ? "ring-2 ring-red-500" : ""}`}
                            placeholder="Enter your email"
                        />
                        {emailError && (
                            <p className="mt-2 text-sm text-red-400">{emailError}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-200 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            onBlur={onPasswordBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition pr-12 ${passwordError ? "ring-2 ring-red-500" : ""}`}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {!showPassword ? <i className="fas fa-eye-slash mt-9 cursor-pointer"></i> : <i className="fas fa-eye mt-9 cursor-pointer"></i>}
                        </button>
                        {passwordError && (
                            <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                        )}
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !formValid}
                        className={`w-full py-3 ${loading || !formValid
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            } text-white font-semibold rounded-xl shadow-md transition relative z-10`}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-300 relative z-10">
                    Don't have an account?{" "}
                    <Link onClick={ () => {
                        sessionStorage.setItem("hasReloadedSignup", "false");
                    }} href="/signup" className="text-indigo-400 font-semibold hover:underline">
                        Sign Up Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
