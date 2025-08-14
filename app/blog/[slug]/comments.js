"use client";
import { useEffect, useState } from "react";
import styles from "./post-detail.module.css";

export default function CommentPanel({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    async function fetchUserAvatar() {
      try {
        const res = await fetch(`/api/user?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user avatar");
        const userData = await res.json();
        setUserAvatar(userData.avatar_url || "/default-avatar.png");
      } catch (err) {
        console.error("Error fetching user avatar:", err);
        setUserAvatar("/default-avatar.png");
      }
    }
    fetchUserAvatar();
  }, [userId]);

  function timeAgo(isoString) {
    const now = new Date();
    const created = new Date(isoString);
    const diffMs = now - created;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "created just now";
    if (diffMinutes < 60) return `created ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `created ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `created ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffMonths < 12) return `created ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `created ${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  }

  function groupComments(comments) {
    const commentMap = new Map();
    const topLevel = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    comments.forEach((comment) => {
      if (comment.parent_comment_id === null) {
        topLevel.push(comment);
      } else {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) parent.replies.push(comment);
      }
    });

    return topLevel;
  }

  async function handleSubmitReply(parentCommentId) {
    if (!replyText.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId,
          content: replyText,
          parentCommentId,
          avatar_url: userAvatar,
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to submit reply");

      setReplyText("");
      setReplyTo(null);
      await fetchComments();
      setExpandedReplies((prev) => ({
        ...prev,
        [parentCommentId]: true,
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch comments: ${errorText}`);
      }
      const data = await res.json();
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  }

  async function submitComment() {
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId,
          content: newComment,
          parentCommentId: null,
          avatar_url: userAvatar,
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to submit comment");
      const data = await res.json();
      setNewComment("");
      await fetchComments();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className={styles.commentsContainer}>
      <h4>{comments.length} Comment(s)</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className={styles.commentsList}>
        {groupComments(comments).map((comment) => (
          <div key={comment.id} className={styles.commentBlock}>
            <div className={styles.commentContent}>
              <h4 className={styles.parentComment}>
                <img
                  src={comment.avatar_url || "/default-avatar.png"}
                  alt={`${comment.username}'s avatar`}
                  className={styles.avatar}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                    console.error(`Avatar load failed for ${comment.username}, using default:`, e.target.src);
                    e.target.onError = null;
                  }}
                />
                {comment.username}{" "}
                <span className={styles.timestamp}>{timeAgo(comment.created_at)}</span>
              </h4>
              <p className={styles.comments}>{comment.content}</p>
              <div className={styles.commentActions}>
                <button
                  className={styles.replyToggle}
                  onClick={() => {
                    setReplyTo(comment.id);
                    setReplyText("");
                  }}
                >
                  Reply
                </button>
                {comment.replies.length > 0 && (
                  <button
                    className={styles.replyToggle}
                    onClick={() =>
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [comment.id]: !prev[comment.id],
                      }))
                    }
                  >
                    {expandedReplies[comment.id]
                      ? "Hide replies"
                      : `${comment.replies.length} repl${comment.replies.length === 1 ? "y" : "ies"}`}
                  </button>
                )}
              </div>
              {replyTo === comment.id && (
                <div className={styles.replyBox}>
                  <textarea
                    className={styles.replyTextarea}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button
                    className={styles.submitReplyButton}
                    onClick={() => handleSubmitReply(comment.id)}
                  >
                    Submit Reply
                  </button>
                </div>
              )}
            </div>
            {expandedReplies[comment.id] && (
              <div className={styles.repliesContainer}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className={styles.replyItem}>
                    <div className={styles.commentContent}>
                      <h4 className={styles.parentComment}>
                        <img
                          src={reply.avatar_url || "/default-avatar.png"}
                          alt={`${reply.username}'s avatar`}
                          className={styles.avatar}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                            console.error(`Avatar load failed for ${reply.username}, using default:`, e.target.src);
                            e.target.onError = null;
                          }}
                        />
                        {reply.username}{" "}
                        <span className={styles.timestamp}>{timeAgo(reply.created_at)}</span>
                      </h4>
                      <p className={styles.comments}>{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <textarea
        placeholder="Type your thoughts here"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className={styles.textarea}
      />
      <button onClick={submitComment} className={styles.button}>Submit Comment</button>
    </div>
  );
}