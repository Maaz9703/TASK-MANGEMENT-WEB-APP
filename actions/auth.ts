"use server";

import { redis } from "@/lib/redis";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function registerUser(data: any) {
  const validated = registerSchema.parse(data);
  try {
    // Check if user exists in Redis
    const existing = await redis.get(`user:${validated.email}`);
    if (existing) throw new Error("User already exists");

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const user = {
      id: crypto.randomUUID(),
      name: validated.name,
      email: validated.email,
      passwordHash,
      provider: "credentials",
      createdAt: new Date().toISOString(),
    };

    // Store user in Redis
    await redis.set(`user:${validated.email}`, user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Something went wrong with Redis storage");
  }
}
