'use server';

import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState, formData) {
    const title = formData.get('title');
    const image = formData.get('image');
    const content = formData.get('content');
    const { user } = await verifyAuth(); // Get authenticated user
    const userId = user?.id || null; // Use user.id if available, null otherwise
  
    let errors = [];

    if(!title || title.trim().length === 0){
        errors.push("Title is required");
    }

    if(!content || content.trim().length === 0){
      errors.push("Content is required");
    }

    if(!image || image.size === 0){
      errors.push("Image is required");
    }

    if(errors.length > 0){
      return { errors };
    }

    let imageUrl;

    try{
        imageUrl = await uploadImage(image);
    }catch{
        throw new Error('Image upload failed :P');
    }

    await storePost({
      imageUrl: imageUrl,
      title,
      content,
      userId
    });

    redirect('/blog');
}

export async function togglePostLikeStatus(postId) {
    await updatePostLikeStatus(postId, 2);
    revalidatePath('/','layout');
}