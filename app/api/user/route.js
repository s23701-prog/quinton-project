// app/api/user/route.js
import { getUser } from "@/lib/user";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("API GET /user: userId =", userId);

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
  }

  try {
    const numericUserId = parseInt(userId, 10); // Explicitly convert to number
    if (isNaN(numericUserId)) {
      return new Response(JSON.stringify({ error: "userId must be a valid number" }), { status: 400 });
    }

    const user = getUser(numericUserId); // Pass as number for id lookup
    console.log("User data:", user);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ avatar_url: user.avatar || "/default-avatar.png" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /user:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}