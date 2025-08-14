// lib/auth.js
import { cookies } from "next/headers";
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import Database from "better-sqlite3";

// --- shared DB instance ---
const db = new Database("posts.db");
const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);
  if (!sessionCookie?.value) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionCookie.value);
  const { session } = result;
  if (!session) {
    return { user: null, session: null };
  }

  // Pull the numeric userId directly from session.userId
  // (Lucia stores it as a string like "1.0", so parseInt)
  const rawUserId = session.userId;
  const userId = parseInt(String(rawUserId).split(".")[0], 10);

  let username = null;
  try {
    const row = db
      .prepare("SELECT id, username FROM users WHERE id = ?")
      .get(userId);
    if (row) {
      username = row.username;
    }
  } catch (e) {
    console.log('hey, failed to fetch user');
  }

  // Return a user object with id & username
  return {
    user: { id: userId, username },
    session,
  };
}

export async function destroySession() {
  const { session } = await verifyAuth();
  if (!session) return { error: "Unauthorized!" };
  await lucia.invalidateSession(session.id);
  const blank = lucia.createBlankSessionCookie();
  cookies().set(blank.name, blank.value, blank.attributes);
}

export async function createAuthCookiesOnLogin(userId) {
  // helper in your login/signup actions
  const session = await lucia.createSession(userId, {});
  const sc = lucia.createSessionCookie(session.id);
  cookies().set(sc.name, sc.value, sc.attributes);
}
