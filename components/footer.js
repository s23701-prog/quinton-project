import Link from "next/link";

export default function Footer(){
    return(
        <footer className="site-footer">
            <div>
                <h3>Welcome to Revision Club, the ultimate club</h3>
                <p>Tel: +852 9454 5164</p>
            </div>
            <div className="links">
                <h3>Educative Sites</h3>
                <Link href="/music-theory">Music Theory</Link>
                <Link href="/english-tenses">English Tenses</Link>
                <Link href="/coming-soon">Secret Diary</Link>
            </div>
            <div style={{ flexBasis: '100%', marginTop: '2rem', borderTop: '1px solid #000', paddingTop: '1rem', fontSize: '0.9rem' }}>
                © 2024 All rights reserved.
            </div>
      </footer>
    );
}