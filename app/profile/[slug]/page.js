// app/profile/[slug]/page.js
import Header from "@/app/header";
import { verifyAuth } from "@/lib/auth";
import { getUser } from "@/lib/user";

export default async function ProfilePage({ params }) {
  const { slug } = params;
  console.log("Processing slug:", slug);

  // Basic slug sanity check
  if (!slug || typeof slug !== "string" || !slug.trim() || slug.includes(".")) {
    console.log("Invalid slug detected:", slug);
    return <div>Invalid profile URL</div>;
  }

  // Ensure the visitor is authenticated
  const { user: authUser } = await verifyAuth();
  if (!authUser) {
    return <div>Authentication required</div>;
  }

  // Lookup the requested profile
  const userData = getUser(slug);
  if (!userData) {
    console.log("No user found for slug:", slug);
    return <div>User not found</div>;
  }

  return <ProfilePage userData={userData}/>
}