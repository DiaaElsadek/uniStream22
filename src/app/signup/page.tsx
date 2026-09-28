"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  Hash,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
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

type SignupResponse = {
  message: string;
  status: boolean;
  type: string;
};

async function handelSignup(
  academicId: string,
  email: string,
  password: string,
  fullName: string,
  userToken: string
): Promise<SignupResponse> {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ academicId, email, password, fullName, userToken }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("handelSignup error:", err);
    return { message: "Unexpected server error. Please try again.", status: false, type: "error" };
  }
}

const onlyLettersDigits = /^[A-Za-z0-9]+$/;
const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, "").replace(/script/gi, "").trim();
const sanitizeFullName = (v: string) => v.replace(/[^A-Za-z0-9\u0600-\u06FF\s]/g, "");

export default function SignupPage() {
  const [academicId, setAcademicId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [academicError, setAcademicError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [pwLenOk, setPwLenOk] = useState(false);
  const [pwLettersDigitsOk, setPwLettersDigitsOk] = useState(false);

  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const academicRegex = /^4202[234]\d{3}$/;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    setPwLenOk(password.length === 8);
    setPwLettersDigitsOk(onlyLettersDigits.test(password));

    if (password.length === 0) {
      setPasswordError(null);
    } else if (password.length !== 8) {
      setPasswordError(t("auth.passwordExact8"));
    } else if (!onlyLettersDigits.test(password)) {
      setPasswordError(t("auth.passwordAlphanumeric"));
    } else {
      setPasswordError(null);
    }
  }, [password, t]);

  const onFullNameChange = (value: string) => {
    const sanitizedValue = sanitizeFullName(value);
    if (sanitizedValue.length > 25) return;
    setFullName(sanitizedValue);

    if (sanitizedValue.length === 0) {
      setFullNameError(t("auth.fullNameRequired"));
    } else if (sanitizedValue.length < 3) {
      setFullNameError(t("auth.fullNameMin"));
    } else {
      setFullNameError(null);
    }
  };

  const onAcademicChange = (value: string) => {
    const sanitizedValue = sanitize(value).replace(/\D/g, "").slice(0, 8);
    setAcademicId(sanitizedValue);

    if (sanitizedValue.length === 0) {
      setAcademicError(null);
    } else if (sanitizedValue.length < 8) {
      setAcademicError(t("auth.academicIdRequired"));
    } else if (!academicRegex.test(sanitizedValue)) {
      setAcademicError(t("auth.academicIdInvalid"));
    } else {
      setAcademicError(null);
    }
  };

  const onEmailChange = (value: string) => {
    const sanitizedValue = sanitize(value);
    setEmail(sanitizedValue);

    if (sanitizedValue.length === 0) {
      setEmailError(null);
    } else if (!emailRegex.test(sanitizedValue)) {
      setEmailError(t("auth.emailInvalid"));
    } else {
      setEmailError(null);
    }
  };

  const onPasswordChange = (value: string) => {
    const sanitizedValue = sanitize(value).slice(0, 8);
    setPassword(sanitizedValue);
  };

  const formValid =
    academicId.length === 8 &&
    academicRegex.test(academicId) &&
    emailRegex.test(email) &&
    password.length === 8 &&
    onlyLettersDigits.test(password) &&
    fullName.trim().length >= 3 &&
    !academicError &&
    !emailError &&
    !passwordError &&
    !fullNameError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!formValid) {
      if (!academicRegex.test(academicId)) {
        setAcademicError(t("auth.academicIdInvalid"));
      }
      if (!emailRegex.test(email)) {
        setEmailError(t("auth.emailInvalid"));
      }
      if (!(password.length === 8 && onlyLettersDigits.test(password))) {
        setPasswordError(t("auth.passwordExact8"));
      }
      return;
    }

    setLoading(true);
    try {
      const userToken = `Token-${academicId}-${crypto.randomUUID()}`;
      const result = await handelSignup(academicId, email, password, fullName, userToken);

      if (result.status) {
        localStorage.setItem("academicId", academicId);
        localStorage.setItem("email", email);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userToken", userToken);
        router.push("/selectschedule");
      } else {
        if (result.type === "academicId") {
          setAcademicError(result.message);
        } else if (result.type === "email") {
          setEmailError(result.message);
        } else {
          setGeneralError(result.message || "Registration failed. Please check your data.");
        }
      }
    } catch (err) {
      console.error("signup submit error:", err);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 selection:bg-primary/20 selection:text-primary bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.12),transparent_70%)]">
      {/* Top Bar with Brand, Language Toggle & Theme Toggle */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-xs shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-tight">UniStream22</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Signup Card */}
      <div className="w-full max-w-lg mx-auto my-8">
        <Card className="rounded-2xl border-border/80 bg-card/95 backdrop-blur-md shadow-xl shadow-black/5 dark:shadow-black/20">
          <CardHeader className="text-center pb-6 space-y-2">
            <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-2xs">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              {t("auth.signupTitle")}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              {t("auth.signupSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {generalError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3.5 text-xs rounded-xl bg-destructive/10 border border-destructive/20 text-destructive animate-fade-in"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  {t("auth.fullNameLabel")}
                </label>
                <div className="relative group">
                  <User
                    className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    id="fullName"
                    name="name"
                    required
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    placeholder={t("auth.fullNamePlaceholder")}
                    aria-invalid={Boolean(fullNameError)}
                    aria-describedby={fullNameError ? "fullName-error" : undefined}
                    className="w-full rounded-xl border border-border bg-card ps-10 pe-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-2xs hover:border-border-strong"
                  />
                </div>
                {fullNameError && (
                  <p id="fullName-error" className="text-xs text-destructive pt-0.5">
                    {fullNameError}
                  </p>
                )}
              </div>

              {/* Academic ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="academicId"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    {t("auth.academicIdLabel")}
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">{t("auth.academicIdHint")}</span>
                </div>
                <div className="relative group">
                  <Hash
                    className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    id="academicId"
                    name="academicId"
                    required
                    maxLength={8}
                    value={academicId}
                    onChange={(e) => onAcademicChange(e.target.value)}
                    placeholder={t("auth.academicIdPlaceholder")}
                    aria-invalid={Boolean(academicError)}
                    aria-describedby={academicError ? "academic-error" : undefined}
                    className="w-full rounded-xl border border-border bg-card ps-10 pe-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-2xs hover:border-border-strong"
                  />
                </div>
                {academicError && (
                  <p id="academic-error" className="text-xs text-destructive pt-0.5">
                    {academicError}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  {t("auth.emailLabel")}
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
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
                    placeholder="student@hti.edu.eg"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full rounded-xl border border-border bg-card ps-10 pe-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-2xs hover:border-border-strong"
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-xs text-destructive pt-0.5">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  {t("auth.passwordLabel")}
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    maxLength={8}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder={t("auth.signupPasswordHint")}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby="password-rules"
                    className="w-full rounded-xl border border-border bg-card ps-10 pe-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-2xs hover:border-border-strong"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Password Criteria Checklist */}
                <div id="password-rules" className="pt-2 space-y-1.5 p-3 rounded-xl bg-secondary/50 border border-border/60">
                  <div className="flex items-center gap-2 text-xs">
                    {pwLenOk ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className={pwLenOk ? "text-foreground font-semibold" : "text-muted-foreground"}>
                      {t("auth.ruleLength")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {pwLettersDigitsOk && password.length > 0 ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span
                      className={
                        pwLettersDigitsOk && password.length > 0
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      {t("auth.ruleChars")}
                    </span>
                  </div>
                </div>

                {passwordError && (
                  <p className="text-xs text-destructive pt-0.5">{passwordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={!formValid}
                className="w-full h-11 mt-3 text-sm font-semibold shadow-md shadow-primary/20"
              >
                <span>{loading ? t("auth.registering") : t("auth.registerBtn")}</span>
                {!loading && <ArrowIcon className="h-4 w-4 ms-1.5" aria-hidden="true" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2 pb-6 text-center text-xs text-muted-foreground">
            <p>
              {t("auth.hasAccount")}{" "}
              <Link
                href="/login"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                {t("auth.signInInstead")}
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