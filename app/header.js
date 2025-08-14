// app/header.js
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/actions/auth-actions";
import { verifyAuth } from "@/lib/auth";

export default async function Header() {
  // SERVER COMPONENT: we can call verifyAuth() here
  const { user } = await verifyAuth();
  const username = user?.username;

  return (
    <header className="navbar">
      <Link href="/homepage">
        <div className="logo">
          <Image src="/icon.png" alt="Revision Club Logo" width={80} height={80} />
        </div>
      </Link>
      <p style={{ color: "white", marginLeft: "10px" }}>
        {username ? `Welcome back, ${username}!` : "Welcome!"}
      </p>
      {username && (
        <form action={logout}>
          <button type="submit" className="logout-button zoom">Log Out</button>
        </form>
      )}
      <nav>
        <Link href="/blog" className="cool-link">Blog</Link>
        {username ? (
          <Link href={`/profile/${username}`}>Profile</Link>
        ) : (
          <Link href="/signIn?mode=login">Sign In</Link>
        )}
        <Link href="/roulette">Roulette</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/bonus-points">Bonus Points</Link>
      </nav>
    </header>
  );
}
