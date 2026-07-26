import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    username: string;
    teacherId: string | null;
  }
  interface Session {
    user: {
      name?: string | null;
      role: Role;
      username: string;
      teacherId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    username: string;
    teacherId: string | null;
  }
}
