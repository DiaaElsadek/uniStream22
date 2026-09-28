"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  User,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

type LoginResponse = {
  message: string;
  status: boolean;
  type?: string;
  user?: {
    academicId: string;
    email: string;
    fullName: string;
    userToken: string;
    role: string;
  };
};

async function handelLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data as LoginResponse;
    } catch {
      console.error("handelLogin: server returned non-json:", text);
      return { message: "Server error", status: false };
    }
  } catch (err) {
    console.error("handelLogin error:", err);
    return { message: "Unexpected error", status: false };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail") || localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const onEmailChange = (value: string) => {
    setEmail(value);
    if (value.length === 0) {
      setEmailError(t("auth.emailRequired"));
    } else if (!emailRegex.test(value)) {
      setEmailError(t("auth.emailInvalid"));
    } else {
      setEmailError(null);
    }
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    if (value.length === 0) {
      setPasswordError(t("auth.passwordRequired"));
    } else if (value.length < 6) {
      setPasswordError(t("auth.passwordMin"));
    } else {
      setPasswordError(null);
    }
  };

  const formValid = !emailError && !passwordError && email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await handelLogin(email.trim(), password);

      if (res.status && res.user) {
        localStorage.setItem("savedEmail", email.trim());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("academicId", res.user.academicId);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("fullName", res.user.fullName);
        localStorage.setItem("userToken", res.user.userToken);
        document.cookie = `role=${encodeURIComponent(res.user.role)}; path=/; Secure; SameSite=Lax`;

        sessionStorage.setItem("hasReloadedSignup", "false");
        sessionStorage.setItem("hasReloadedLogin", "false");
        router.replace("/home");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("submit error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    setError(null);

    try {
      const res = await handelLogin("guest@mail.com", "12345678");

      if (res.status && res.user) {
        localStorage.setItem("savedEmail", "guest@mail.com");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("academicId", res.user.academicId);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("fullName", res.user.fullName);
        localStorage.setItem("userToken", res.user.userToken);
        document.cookie = `role=${encodeURIComponent(res.user.role)}; path=/; Secure; SameSite=Lax`;

        sessionStorage.setItem("hasReloadedSignup", "false");
        sessionStorage.setItem("hasReloadedLogin", "false");
        router.replace("/home");
      } else {
        setError(res.message || "Guest login is currently unavailable.");
      }
    } catch (err) {
      console.error("guest login error:", err);
      setError("Failed to continue as guest. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 selection:bg-primary/20 selection:text-primary">
      {/* Top Bar with Brand, Language Toggle & Theme Toggle */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <span>UniStream22</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {t("auth.loginTitle")}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {t("auth.loginSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3 text-sm rounded-md bg-destructive/10 border border-destructive/20 text-destructive"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  {t("auth.emailLabel")}
                </label>
                <div className="relative">
                  <Mail
                    className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full rounded-md border border-border bg-background ps-9 pe-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-xs text-destructive">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("auth.passwordLabel")}
                  </label>
                  <Link
                    href="https://wa.me/201117244172"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <MessageCircle className="h-3 w-3" aria-hidden="true" />
                    <span>{t("auth.forgotPassword")}</span>
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder={t("auth.passwordPlaceholder")}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className="w-full rounded-md border border-border bg-background ps-9 pe-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="text-xs text-destructive">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={!formValid || guestLoading}
                className="w-full h-10 mt-2 font-medium"
              >
                <span>{loading ? t("auth.signingIn") : t("auth.signInBtn")}</span>
                {!loading && <ArrowIcon className="h-4 w-4 ms-1" aria-hidden="true" />}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("auth.or")}</span>
              </div>
            </div>

            {/* Continue as Guest Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGuest}
              isLoading={guestLoading}
              disabled={loading}
              className="w-full h-10 font-medium"
            >
              <User className="h-4 w-4 me-1.5" aria-hidden="true" />
              <span>{t("auth.guestBtn")}</span>
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2 pb-6 text-center text-xs text-muted-foreground">
            <p>
              {t("auth.noAccount")}{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                {t("auth.signUpNow")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4">
        <p>{t("common.copyright", { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}