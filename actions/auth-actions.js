"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { lucia, verifyAuth as _verifyAuth } from "@/lib/auth";

//
// ——— PUBLIC SESSION READ (no cookie write) ———
//
export async function getSession() {
  const { user, session } = await _verifyAuth();
  return { user, session };
}

//
// ——— SESSION REFRESH (cookie-write allowed in Route Handler) ———
//
export async function refreshSessionCookie() {
  const { user, session } = await _verifyAuth();

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } else if (!session) {
    const blank = lucia.createBlankSessionCookie();
    cookies().set(blank.name, blank.value, blank.attributes);
  }

  return { user, session };
}

//
// ——— SIGNUP / LOGIN / LOGOUT ———
//
export async function signup(prevState, formData) {
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const username = formData.get("username")?.trim();
  const errors = {};

  // Validate email
  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  // Validate password
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  // Validate username
  if (!username || username.length < 3) {
    errors.username = "Username is required and must be at least 3 characters long.";
  } else if (username.includes(' ')) {
    errors.username = 'Username cannot contain spaces.';
    return { errors };
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const hashedPassword = hashUserPassword(password);
    const userId = createUser(email, hashedPassword, username);

    // Create session and set cookie
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Redirect after successful setup
    redirect(`/profile/${username}`);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "An account with that email already exists.",
          username: "That username may already be taken.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email: "Could not authenticate—please check your credentials.",
      },
    };
  }

  const valid = verifyPassword(existingUser.password, password);
  if (!valid) {
    return {
      errors: {
        password: "Could not authenticate—please check your credentials.",
      },
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/homepage");
}

export async function logout() {
  const { session } = await _verifyAuth();
  if (session) {
    await lucia.invalidateSession(session.id);
    const blank = lucia.createBlankSessionCookie();
    cookies().set(blank.name, blank.value, blank.attributes);
  }
  redirect("/");
}