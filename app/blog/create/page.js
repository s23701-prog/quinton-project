import PostForm from '@/components/post-form';
import Footer from '@/components/footer';
import { createPost } from '@/actions/posts';
import { getUser } from '@/lib/user';
import { verifyAuth } from '@/lib/auth';

export default async function CreateBlogPage() {
  const { user } = await verifyAuth(); // Get authenticated user  

  return (
    <>
           <main className="create-post-page">
            <PostForm action={createPost} user={user}/>
            </main>
        <Footer />
    </>
  );
}