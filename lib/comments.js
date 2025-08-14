// lib/comments.js
import sql from "better-sqlite3";

const db = new sql("posts.db");

export function getCommentsForPost(postId) {
  try {
    const stmt = db.prepare(`
      SELECT c.id, c.content, c.created_at, c.parent_comment_id, c.user_id, c.avatar_url
      FROM comments c
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `);
    return stmt.all(postId);
  } catch (error) {
    console.error("Database error in getCommentsForPost:", error);
    throw error;
  }
}

export function addComment({ postId, userId, content, parentCommentId = null, avatar_url }) {
  if (!postId || !userId || !content) {
    throw new Error("Missing required fields: postId, userId, or content");
  }

  const userExists = db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
  if (!userExists) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  const postExists = db.prepare("SELECT 1 FROM posts WHERE id = ?").get(postId);
  if (!postExists) {
    throw new Error(`Post with ID ${postId} does not exist`);
  }

  console.log("Adding comment with avatar_url:", avatar_url); // Debug log

  try {
    const stmt = db.prepare(`
      INSERT INTO comments (content, user_id, post_id, parent_comment_id, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(content, userId, postId, parentCommentId, avatar_url || null);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw new Error("Failed to add comment: " + error.message);
  }
}