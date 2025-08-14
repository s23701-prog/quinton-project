// app/api/comments/route.js
import { getCommentsForPost, addComment } from "@/lib/comments";
import { getUser } from "@/lib/user";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  console.log("API GET /comments: postId =", postId);

  if (!postId) {
    console.log("Missing postId");
    return new Response(JSON.stringify({ error: "postId is required" }), { status: 400 });
  }

  try {
    const comments = await getCommentsForPost(postId);
    console.log("Fetched comments:", comments);

    const enrichedComments = comments.map((comment) => {
      const user = getUser(comment.user_id);
      console.log(`Enriching comment ${comment.id} with user:`, user);
      return {
        ...comment,
        avatar_url: user?.avatar_url || "/default-avatar.png", // Use avatar_url from user
        username: user?.username || "Unknown", // Already working
      };
    });
    console.log("Enriched comments:", enrichedComments);

    return new Response(JSON.stringify(enrichedComments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /comments:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  const { postId, userId, content, parentCommentId, avatar_url } = await request.json();

  console.log("API POST /comments:", { postId, userId, content, parentCommentId, avatar_url });

  if (!postId || !userId || !content) {
    console.log("Missing required fields");
    return new Response(JSON.stringify({ error: "postId, userId, and content are required" }), { status: 400 });
  }

  try {
    const result = await addComment({ postId, userId, content, parentCommentId, avatar_url });
    console.log("Comment added:", result);
    return new Response(JSON.stringify({ success: true, id: result.id }), { status: 201 });
  } catch (error) {
    console.error("Error in POST /comments:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}