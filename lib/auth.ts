import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redis } from "./redis";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) return null;

        // Find user in Redis
        // Find user in Redis
        const user = await redis.get(`user:${email}`) as any;
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
});
