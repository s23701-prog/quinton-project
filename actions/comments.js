'use server';
import { addComment } from '@/lib/posts';

export async function submitComment(prevState, formData) {
  const postId = formData.get('postId');
  const userId = 2; // hardcoded for now
  const content = formData.get('comment');

  if (!content || content.trim().length === 0) {
    return { success: false, message: 'Comment cannot be empty.' };
  }

  await addComment({ postId, userId, content });
  return { success: true };
}

