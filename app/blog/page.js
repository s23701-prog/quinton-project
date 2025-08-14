
'use server';

import Footer from '@/components/footer';
import Header from '@/app/header';  
import { Suspense } from 'react';
import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';
import Link from 'next/link';
import { togglePostLikeStatus } from '@/actions/posts';
import { verifyAuth } from '@/lib/auth';
import styles from './blog.module.css';

async function LatestPosts() {
    const { user } = await verifyAuth(); // Get authenticated user  
    const latestPosts = await getPosts();
    return <Posts posts={latestPosts} action={togglePostLikeStatus} user={user}/>;
}

export default async function Home() {
  return (
    <>
        <Header />
        <main className="blog-container">
        <header className="blog-header">
            <h1 className={styles.pageTitle}>Create your own blog</h1>
            <p className={styles.pageSubtitle}>Share your thoughts, reflections, and revisions.</p>
            <Link href="/blog/create" className={styles.newPostButton}>
              + Start a new post
            </Link>
        </header>

        <section className="latest-posts">
            <Suspense fallback={<p>Loading posts...</p>}>
            <LatestPosts />
            </Suspense>
        </section>
        </main>
      <Footer />
    </>
  );
}