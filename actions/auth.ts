"use server";

import { redis } from "@/lib/redis";
import { registerSchema } from "@/lib/validations";
import { getUserProjects, seedStarterProject } from "@/lib/data";
import bcrypt from "bcryptjs";

// Public demo account (shown on the login page; it only ever sees sample data).
const DEMO_EMAIL = "demo@motion.app";
const DEMO_PASSWORD = "demo1234";

type StoredUser = { id: string; name: string; email: string; passwordHash: string; provider: string; createdAt: string };

async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };
  await redis.set(`user:${email}`, user);
  return user;
}

export async function registerUser(data: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Please check your details and try again." };
  const email = parsed.data.email.trim().toLowerCase();
  try {
    if (await redis.get(`user:${email}`)) return { ok: false, error: "An account with this email already exists." };
    const user = await createUser(parsed.data.name.trim(), email, parsed.data.password);
    await seedStarterProject(user.id);
    return { ok: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Makes sure the public demo account exists and always has sample data,
 * so visitors can explore the app with one click.
 */
export async function prepareDemo(): Promise<{ email: string; password: string }> {
  let user = await redis.get<StoredUser>(`user:${DEMO_EMAIL}`);
  if (!user) user = await createUser("Demo User", DEMO_EMAIL, DEMO_PASSWORD);
  if ((await getUserProjects(user.id)).length === 0) await seedStarterProject(user.id);
  return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
}
