// app/profile/avatar/page.js
import AvatarUpload from "@/app/profile/avatar/fart";
import { verifyAuth } from "@/lib/auth";
import styles from "../[slug]/profile.module.css";
import Header from "@/app/header";

export default async function AvatarPage() {
  const { user: authUser } = await verifyAuth();
  if (!authUser) {
    return <div>Authentication required</div>;
  }

  return (
    <>
    <Header />
      <div className={styles.profileContainer}>
        <AvatarUpload userId={authUser.id} slug={authUser.username} currentAvatar={authUser.avatar_url} />
      </div>
    </>
  );
}