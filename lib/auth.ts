import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

/**
 * إعدادات المصادقة الموحدة لكل من الأدمن والأساتذة.
 * كلاهما يستخدم نفس جدول users مع تمييز بحقل role،
 * وكل التوجيه بعد الدخول يعتمد على هذا الحقل.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "اسم المستخدم", type: "text" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { username: credentials.username },
          include: { teacher: true },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.teacher?.fullName ?? user.username,
          username: user.username,
          role: user.role,
          // teacherId ضروري لفلترة كل بيانات الأستاذ في الـ API لاحقًا
          teacherId: user.teacher?.id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.teacherId = (user as any).teacherId;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).teacherId = token.teacherId;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
};

/** يُستخدم عند إنشاء حساب أستاذ جديد من لوحة الأدمن */
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}
