"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, User, Lock, Eye, EyeOff, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { HeroNotebookStack } from "@/components/HeroNotebookStack";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    // نجلب الجلسة لمعرفة الدور ونوجّه المستخدم للوحته الصحيحة
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    router.push(role === "ADMIN" ? "/admin" : "/teacher/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen bg-paper lg:items-stretch">
      {/* ============================================================
          لوحة الهوية البصرية — تظهر فقط على شاشات الكمبيوتر/التابلت
          الكبيرة (lg فأعلى)، وتختفي تمامًا على الجوال حتى لا تأخذ
          مساحة من نموذج الدخول على الشاشات الصغيرة.
          ============================================================ */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-white lg:flex xl:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(var(--color-marker)) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />

        <Link href="/" className="relative flex items-center gap-2.5 font-display text-2xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </span>
          مكتبة الصديقين
        </Link>

        <div className="relative">
          <HeroNotebookStack />
          <h2 className="mt-8 max-w-sm font-display text-3xl font-bold leading-snug">
            لوحة إدارة <span className="marker-underline text-white">ملازمك الدراسية</span> في مكان واحد
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            تابع الملازم والطلبات والأرباح، وأدِر مكتبتك بسهولة من أي جهاز.
          </p>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} مكتبة الصديقين — كل الحقوق محفوظة
        </p>
      </div>

      {/* ============================================================
          نموذج تسجيل الدخول — منتصف الشاشة على الجوال، ونصف الشاشة
          الأيمن على الكمبيوتر.
          ============================================================ */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2 lg:px-12 xl:px-20">
        <div className="w-full max-w-sm">
          {/* شعار مبسّط يظهر فقط على الجوال بدل لوحة الهوية الكاملة */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-ink lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/5">
              <BookOpen className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            مكتبة الصديقين
          </Link>

          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:rounded-2xl lg:p-0 lg:shadow-none">
            <h1 className="font-display text-2xl font-bold text-charcoal">تسجيل الدخول</h1>
            <p className="mt-1.5 text-sm text-mist">لأصحاب حسابات الإدارة والأساتذة فقط</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">اسم المستخدم</label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-mist"
                    strokeWidth={1.8}
                  />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    autoComplete="username"
                    placeholder="اسم المستخدم"
                    className="w-full rounded-xl border border-ink/10 bg-paper/40 py-3 pr-11 pl-3.5 text-sm outline-none transition focus:border-ink/40 focus:bg-white focus:ring-4 focus:ring-ink/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">كلمة المرور</label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-mist"
                    strokeWidth={1.8}
                  />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink/10 bg-paper/40 py-3 pr-11 pl-11 text-sm outline-none transition focus:border-ink/40 focus:bg-white focus:ring-4 focus:ring-ink/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist transition hover:text-charcoal"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" strokeWidth={1.8} />
                    ) : (
                      <Eye className="h-4.5 w-4.5" strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-clay/10 px-3.5 py-2.5 text-sm text-clay">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 font-semibold text-white shadow-card transition hover:bg-ink-light disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                دخول
              </button>
            </form>

            <Link
              href="/"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-mist transition hover:text-ink"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
