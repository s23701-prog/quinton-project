import { getPostBySlug } from '@/lib/posts';
import { getCommentsForPost } from '@/lib/comments';
import styles from './post-detail.module.css';
import ImagePreviewer from './imagePreviewer';
import CommentPanel from './comments';
import Link from 'next/link';
import { verifyAuth } from '@/lib/auth';

export default async function PostDetailPage({ params }) {
  const post = await getPostBySlug(params.slug);
  const { user } = await verifyAuth(); // Get authenticated user
  const userId = user?.id || null; // Use user.id if available, null otherwise
  console.log('Fetched post:', post); // Debug log
  console.log('Authenticated userId:', userId); // Debug log

  if (!post || !post.id || !post.image || !post.title || !post.username || !post.createdAt || !post.content) {
    return <div className={styles.container}>Post not found or incomplete data</div>;
  }

  const comments = getCommentsForPost(post.id);
  console.log('Fetched comments:', comments); // Debug log

  return (
    <div className={styles.container}>
      {/* Redirect Link */}
      <Link href="/blog" className={styles.redirectLink}>
        <h4>Back to Blog</h4>
      </Link>

      {/* Post Header with Image and Text Side-by-Side */}
      <div className={styles.postHeader}>
        <ImagePreviewer post={post} />
        <div className={styles.postInfo}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <h4 className={styles.postAuthor}>Created by {post.username} at {post.createdAt}</h4>
        </div>
      </div>

      {/* Post Content */}
      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      {/* Comment Section */}
      <div className={styles.commentSection}>
        <CommentPanel postId={post.id} userId={userId} initialComments={comments} />
      </div>
    </div>
  );
}