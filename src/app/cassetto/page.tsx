'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import styles from './Cassetto.module.css'
import Header from '@/components/Header'

export default function CassettoPage() {
    const [config, setConfig] = useState<any>({})

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => setConfig(data))
    }, [])

    return (
        <div className={styles.container}>
            {/* Minimal Header to retain brand identity without hero image/banner logic if preferred, 
                or just reuse the main Header component. We'll use a modified approach here to keep it distinct. */}
            <Header
                logoPath={config.logoPath}
                logoScale={config.logoScale}
                tagline=""
                bannerText=""
                heroImage={config.heroImagePath}
                heroBlur={config.heroBlur}
                parallaxImage={config.parallaxImagePath}
                heroHeight="30vh"
            />

            <main className={styles.content}>
                <Link href="/" className={styles.backLink}>
                    ← <span className={styles.backText}>MAIN PAGE</span>
                </Link>

                {/* HERO / INTRO */}
                <section className={styles.intro}>
                    <h1 className={styles.title}>CASSETTO</h1>
                    <h2 className={styles.subtitle}>
                        A Private Distribution & Revenue Platform For Independent Music
                    </h2>
                </section>

                {/* THE VISION */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>THE VISION</h3>
                    
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <p className={styles.visionHeadline}>
                            THE SOUND OF TOMORROW, HEARD TODAY.
                        </p>
                        <p className={styles.visionIntro}>
                            Welcome to the Underground.
                        </p>
                        <p style={{ color: 'var(--silver)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
                            The mainstream hasn’t found this sound yet—and that’s exactly the point. Cassetto is a dedicated home for the Underground Nation, a private digital space where the signal is pure and the connection is direct.
                        </p>
                        <p style={{ color: 'var(--silver)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '1.5rem auto 0 auto' }}>
                            When you download Cassetto, you aren’t just getting an app; you’re joining a tribe of listeners and creators who have stepped away from the noise of social media and big streaming corporations. This is a curated sanctuary for music that is too fresh, too raw, and too independent for the masses.
                        </p>
                    </div>

                    {/* Row 1 */}
                    <div className={styles.zRow}>
                        <div className={styles.zText}>
                            <h4>A Collective for the Dedicated</h4>
                            <p>Cassetto features a hand-picked, 10-slot Tape Rack. We’ve brought together a collective of underground artists who share a single mission: to protect the value of the music.</p>
                            <ul>
                                <li><strong style={{ color: 'white' }}>Undiscovered Signals:</strong> Hear the tracks that will define the future, long before they hit the mainstream.</li>
                                <li><strong style={{ color: 'white' }}>Direct Connection:</strong> No algorithms. No ads. No corporate gatekeepers. Just a direct line from the artist's studio to your device.</li>
                                <li><strong style={{ color: 'white' }}>The Tribe:</strong> You aren’t a "user" here—you are a member of a community dedicated to the music and to each other.</li>
                            </ul>
                        </div>
                        <div className={styles.zImage}>
                            <img src="/images/cassetto/tape-rack2.jpg" alt="Tape Rack" />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className={styles.zRowReverse}>
                        <div className={styles.zText}>
                            <h4>Flip the Tape: Exclusive Access</h4>
                            <p>Every release on the rack is a two-sided digital experience designed for the true supporter. The Transport Bar puts full control in your hands with Next/Prev track, FF, RW, Flip Tape & Tape Rack buttons.</p>
                        </div>
                        <div className={styles.zImage}>
                            <img src="/images/cassetto/Main-Screen.jpg" alt="Main Play Screen" />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className={styles.zRow}>
                        <div className={styles.zText}>
                            <h4>Side A (The Main Signal)</h4>
                            <p>High-fidelity streaming of the latest tracks. If the sound moves you, support the artist directly. The download icon allows you to “tip” the artist/DJ or just get the track to keep the underground alive.</p>
                        </div>
                        <div className={styles.zImage}>
                            <img src="/images/cassetto/support-artist2.jpg" alt="Downloads Side A" />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className={styles.zRowReverse}>
                        <div className={styles.zText}>
                            <h4>Side B (The DJ Toolkit)</h4>
                            <p>Flip the tape to access the "Pro" side. This is where artists provide exclusive tools specifically for mixing and remixing. Get access to unique versions you won't find anywhere else: Acapellas, Percapellas, Dubs and Exclusive Remixes.</p>
                            <p>The download icon allows users to securely acquire these limited edition tracks and other premium content.</p>
                        </div>
                        <div className={styles.zImage}>
                            <img src="/images/cassetto/premium-content3.jpg" alt="Downloads Side B" />
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className={styles.zRow}>
                        <div className={styles.zText}>
                            <h4>True Ownership & Digital Scarcity</h4>
                            <p>We believe music should have real value. To honor the era of rare vinyl and hand-labeled mixtapes, Cassetto features Limited Edition releases with verifiable ownership.</p>
                            <ul>
                                <li><strong style={{ color: 'white' }}>Unique Serial Numbers:</strong> When you purchase a limited Side B release, a unique serial number (e.g., Copy #14 of 100) is permanently assigned to your profile.</li>
                                <li><strong style={{ color: 'white' }}>Bespoke Branding:</strong> Each artist has custom-designed their own digital tape and rack placard. This isn't a generic thumbnail; it's a visual tribute to the hand-created labels from the golden era of the underground.</li>
                            </ul>
                        </div>
                        <div className={styles.zImage}>
                            <img src="/images/cassetto/main-screen2.jpg" alt="Digital Scarcity" />
                        </div>
                    </div>

                    <div className={styles.glowBox}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '2rem', margin: '0 0 1.5rem 0', letterSpacing: '4px' }}>
                            TAKE BACK THE VALUE.
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
                            The big platforms own the audience, but they don’t own the tribe. Cassetto is our way of going direct to the people who truly support the sound. Join the Underground Nation today and hear the music as it was meant to be.
                        </p>
                        <p style={{ color: 'red', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '4px', textShadow: '0 0 10px rgba(255,0,0,0.5)', margin: 0 }}>
                            PROTECT THE SIGNAL. JOIN THE TRIBE.
                        </p>
                    </div>
                </section>







                {/* CTA */}
                <section className={styles.ctaContainer}>
                    <h2 className={styles.ctaTitle}>EXPERIENCE CASSETTO</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--silver)' }}>
                        Currently in closed beta testing. Coming soon to the Google Play Store.
                    </p>
                    <a href="#" className={styles.ctaButton} onClick={(e) => { e.preventDefault(); alert('Closed Beta Testing - Downloads currently disabled.') }}>
                        DOWNLOAD NOW
                    </a>
                </section>
            </main>
        </div>
    )
}
