"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function AvatarUpload({ userId, slug }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize router

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setError("Please upload a PNG or JPEG image.");
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      setError("Please select a file and ensure user is logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    setUploading(true);
    setError(null);

    try {
      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      const result = await res.json();
      setUploading(false);

      if (res.ok && result.success) {
        alert("Avatar uploaded!"); // Show alert
        // Redirect to profile page after alert (client-side)
        router.push(`/profile/${slug}`); // Adjust the route as per your app
        setTimeout(5000);
      } else {
        setError(result.error || "Upload failed.");
      }
    } catch (err) {
      setUploading(false);
      setError("An error occurred during upload.");
      console.error(err);
    }
  };

  return (
    <div className="avatar-upload">
      <input
        type="file"
        accept="image/png, image/jpeg"
        id="image"
        name="image"
        onChange={handleFileChange}
      />
      {previewUrl && <div className="row-bro"><h4>Preview :</h4><img src={previewUrl} alt="Preview"/></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button className='avatar-btn ' onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
}