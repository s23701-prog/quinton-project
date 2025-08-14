// app/api/avatar/route.js
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { updateUserAvatar } from "@/lib/user";

export async function POST(request) {
  const { user: authUser } = await verifyAuth();
  if (!authUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No valid avatar file uploaded" }, { status: 400 });
  }
  if (userId !== authUser.id.toString()) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 403 });
  }

  try {
    const avatarUrl = await uploadImage(file, "avatars"); // Use "avatars" folder
    await updateUserAvatar(authUser.id, avatarUrl);
    return NextResponse.json({ success: true, avatarUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}