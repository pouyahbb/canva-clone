import NextAuth from "next-auth";

// import authConfig from "@/auth.config";
import GitHub from "next-auth/providers/github";
import { db } from "@/db/drizzle";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
});
