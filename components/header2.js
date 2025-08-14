import Image from "next/image";
import Link from "next/link";

export default function Header(){
    return(
        <header className="navbar">
            <Link href="/">
                <div className="logo">
                    <Image src="/icon.png" alt="Revision Club Logo" width={80} height={80} />
                </div>
            </Link>

            <p style={{color:'white', marginLeft:'10px'}}>Welcome! <Link href="/signIn" className="special-link font-bro"> SignIn/LogIn</Link></p>
            <nav>
                <Link href="/signIn">Blog</Link>
                <Link href="/signIn">Profile</Link>
                <Link href="/signIn">Roulette</Link>
                <Link href="/signIn">Leaderboard</Link>
                <Link href="/signIn">Bonus Points</Link>
            </nav>
        </header>
    );
}