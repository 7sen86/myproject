import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * هذا الملف هو خط الدفاع الأول (وليس الوحيد) لفصل الصلاحيات.
 * الفصل الحقيقي والملزم يحدث داخل كل API route عبر فلترة teacherId —
 * هذا الملف فقط يمنع الوصول لواجهة الصفحات الخاطئة قبل حتى تحميلها.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/teacher") && token?.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
