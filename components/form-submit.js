'use client';

import { useFormStatus } from "react-dom";

export default function FormSubmit() {
  const status = useFormStatus();

  if (status.pending) {
    return <p>⏳ Creating Post...</p>;
  }

  return (
    <>
      <button type="reset" className="reset-btn">Reset</button>
      <button type="submit" className="submit-btn">Create Post</button>
    </>
  );
}
