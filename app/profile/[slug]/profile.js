import Link from "next/link";
import styles from "./profile.module.css";
import Header from "@/app/header";
export default function({ userData }){
    return (
        <>
          <Header />
          <div className={styles.profileContainer}>
              {userData.avatar_url && (
                <img src={userData.avatar_url} alt="Avatar" width={150} className={styles.profileImage} />
              )}
            {!userData.avatar_url && (
              <Link href="/profile/avatar" className="special-link">Create Your Avatar</Link>
            )}
            {userData.avatar_url && (
              <Link href="/profile/avatar" className="special-link">Change Your Avatar</Link>
            )}
            <div className={styles.profileHeader}>
              <h1>{userData.username}'s Profile</h1>
            </div>
            <div className={styles.profileDetails}>
              <h2>Email: {userData.email}</h2>
              <h2>Current points: {userData.points || 0}</h2>
            </div>
          </div>
        </>
      );
}