import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth-constants";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET manquant dans .env.local");
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  userId: string;
  email: string;
};

export async function createSession(userId: string, email: string) {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  const db = getDb();
  if (!db) return null;

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const user = rows[0];
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return { id: user.id, email: user.email };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
