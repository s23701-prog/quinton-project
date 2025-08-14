// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

CLOUDINARY_CLOUD_NAME=dw2gmwuou
CLOUDINARY_API_KEY=515823314884172
CLOUDINARY_API_SECRET=2gXulVPxrTYb435OqsXa2eN68tw

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImage(image, folder = "nextjs-course-mutations") {
  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: folder,
  });
  return result.secure_url;
}
