"use client";

import FormSubmit from "@/components/form-submit";
import { useFormState } from "react-dom";

export default function PostForm({ action, user }) {
  const [state, formAction] = useFormState(action, {});

  return (
    <div className="create-form-wrapper">
      <h1 className="form-title">Create a New Blog Post</h1>
      <form action={formAction} className="post-form" encType="multipart/form-data">
        {/* Author section with avatar and username */}
        <div className="author">
          <span >Posted by: {user?.username || "Unknown"}</span>
        </div>
        {/* Shifted form content */}
        <div className="form-content">
          <div className="form-control">
            <label htmlFor="title">Post Title</label>
            <input type="text" id="title" name="title" placeholder="Give it a cool title!" required />
          </div>

          <div className="form-control">
            <label htmlFor="image">Image Upload ( MUST NOT exceed 1 MB )</label>
            <input type="file" accept="image/png, image/jpeg" id="image" name="image" />
          </div>

          <div className="form-control">
            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" rows="6" placeholder="Write your thoughts here..." required />
          </div>

          <div className="form-actions">
            <FormSubmit />
          </div>
        </div>

        {state.errors && state.errors.length > 0 && (
          <ul className="form-errors">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}