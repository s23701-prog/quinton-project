import Footer from '@/components/footer';
import Header from '@/components/header2';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <section className="section hero container">
        <div className="text">
          <h1>Welcome to<br />Revision Club!</h1>
          <h3 style={{marginTop:'30px'}}>Join us for a fun-filled<br />learning experience</h3>
        </div>
        <div className="image">
          <Image src="/explore.png" alt="Explore" width={500} height={500} style={{ borderRadius: '20px', width: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="section features container">
        <div className="feature">
          <Image src="/icon3.png" alt="Games" width={110} height={100} />
          <h2>20+ Roulettes & Games</h2>
          <p>Fun and educative games help students learn</p>
        </div>
        <div className="feature">
          <Image src="/icon2.png" alt="Leaderboard" width={110} height={100} />
          <h2>Leaderboard System</h2>
          <p>Encourage competition with points & rewards</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats container">
        <div className="numbers">
          <div>
            <h1>100+</h1>
            <h4>Members</h4>
          </div>
          <div>
            <h1 style={{ color: '#19AC64' }}>97.5</h1>
            <h4 style={{ color: '#19AC64' }}>Average Marks</h4>
          </div>
        </div>
        <div className="image">
          <Image src="/diary.jpg" alt="Diary" width={500} height={500} style={{ borderRadius: '20px', objectFit: 'cover', width: '100%' }} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="section dark cta">
        <div className="container-left" style={{textAlign:'left'}}>
          <Link href='/signIn' className='special-link zoom' style={{color:'white', fontSize:'65px'}}>Join the Revision Club</Link>
          <h3 style={{color:'white'}}>Unlock fun and learning</h3>
        </div>
      </section>
      <Footer />
    </>
  );
}