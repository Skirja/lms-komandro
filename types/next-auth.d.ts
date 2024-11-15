import { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      track?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    track?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    track?: string;
  }
}
