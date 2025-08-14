'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './post-detail.module.css';

export default function ImagePreviewer({ post }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Image
        src={post.image}
        alt={post.title}
        width={300}
        height={200}
        className={styles.postImage}
        onClick={() => setIsPreviewOpen(true)}
      />
      {isPreviewOpen && (
        <div className={styles.imagePreviewer} style={{marginLeft:'-100px'}}onClick={() => setIsPreviewOpen(false)}>
          <div className={styles.previewerContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={post.image}
              alt={post.title}
              className={styles.previewImage}
            />
            <p className={styles.previewText}>Click on the edge to disappear</p>
          </div>
        </div>
      )}
    </>
  );
}