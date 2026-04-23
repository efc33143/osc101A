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
                    « BACK TO TRANSMISSIONS
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
                    
                    <div style={{ lineHeight: '1.8', fontSize: '1.2rem', color: 'white', marginBottom: '3rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '2px' }}>
                            THE SOUND OF TOMORROW, HEARD TODAY.
                        </p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '2rem' }}>
                            Welcome to the Underground.
                        </p>
                        <p style={{ color: 'var(--silver)' }}>
                            The mainstream hasn’t found this sound yet—and that’s exactly the point. Cassetto is a dedicated home for the Underground Nation, a private digital space where the signal is pure and the connection is direct.
                        </p>
                        <p style={{ color: 'var(--silver)', marginTop: '1.5rem' }}>
                            When you download Cassetto, you aren’t just getting an app; you’re joining a tribe of listeners and creators who have stepped away from the noise of social media and big streaming corporations. This is a curated sanctuary for music that is too fresh, too raw, and too independent for the masses.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                        {/* A Collective for the Dedicated */}
                        <div className={styles.card} style={{ width: '100%', maxWidth: '1000px' }}>
                            <h4 className={styles.cardTitle} style={{ color: 'var(--gold)', fontSize: '1.5rem', textAlign: 'center' }}>A Collective for the Dedicated</h4>
                            <p className={styles.cardText} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                Cassetto features a hand-picked, 10-slot Tape Rack. We’ve brought together a collective of underground artists who share a single mission: to protect the value of the music.
                            </p>
                            <ul style={{ color: 'var(--silver)', lineHeight: '1.8', paddingLeft: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                                <li style={{ marginBottom: '1rem' }}><strong style={{ color: 'white' }}>Undiscovered Signals:</strong> Hear the tracks that will define the future, long before they hit the mainstream.</li>
                                <li style={{ marginBottom: '1rem' }}><strong style={{ color: 'white' }}>Direct Connection:</strong> No algorithms. No ads. No corporate gatekeepers. Just a direct line from the artist's studio to your device.</li>
                                <li><strong style={{ color: 'white' }}>The Tribe:</strong> You aren’t a "user" here—you are a member of a community dedicated to the music and to each other.</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
                            {/* Flip the Tape */}
                            <div className={styles.card} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <h4 className={styles.cardTitle} style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>Flip the Tape: Exclusive Access</h4>
                                <p className={styles.cardText} style={{ marginBottom: '1.5rem' }}>
                                    Every release on the rack is a two-sided digital experience designed for the true supporter:
                                </p>
                                <ul style={{ color: 'var(--silver)', lineHeight: '1.8', paddingLeft: '0', listStyle: 'none', textAlign: 'left', width: '100%' }}>
                                    <li style={{ marginBottom: '1.5rem' }}><strong style={{ color: 'white' }}>Side A (The Main Signal):</strong> High-fidelity streaming of the latest tracks. If the sound moves you, support the artist directly with a "tip" to keep the underground alive.</li>
                                    <li><strong style={{ color: 'white' }}>Side B (The DJ Toolkit):</strong> Flip the tape to access the "Pro" side. This is where artists provide exclusive tools specifically for mixing and remixing. Get access to unique versions you won't find anywhere else:
                                        <ul style={{ marginTop: '0.5rem', color: 'var(--gold)', listStylePosition: 'inside' }}>
                                            <li>Acapellas</li>
                                            <li>Percapellas</li>
                                            <li>Dubs and Exclusive Remixes</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            {/* True Ownership */}
                            <div className={styles.card} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <h4 className={styles.cardTitle} style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>True Ownership & Digital Scarcity</h4>
                                <p className={styles.cardText} style={{ marginBottom: '1.5rem' }}>
                                    We believe music should have real value. To honor the era of rare vinyl and hand-labeled mixtapes, Cassetto features Limited Edition releases with verifiable ownership.
                                </p>
                                <ul style={{ color: 'var(--silver)', lineHeight: '1.8', paddingLeft: '0', listStyle: 'none', textAlign: 'left', width: '100%' }}>
                                    <li style={{ marginBottom: '1.5rem' }}><strong style={{ color: 'white' }}>Unique Serial Numbers:</strong> When you purchase a limited Side B release, a unique serial number (e.g., Copy #14 of 100) is permanently assigned to your profile.</li>
                                    <li><strong style={{ color: 'white' }}>Bespoke Branding:</strong> Each artist has custom-designed their own digital tape and rack placard. This isn't a generic thumbnail; it's a visual tribute to the hand-created labels from the golden era of the underground.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'rgba(20,20,20,0.8)', border: '1px solid var(--gold)', borderRadius: '4px' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '4px' }}>
                            TAKE BACK THE VALUE.
                        </h4>
                        <p style={{ color: 'var(--silver)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
                            The big platforms own the audience, but they don’t own the tribe. Cassetto is our way of going direct to the people who truly support the sound. Join the Underground Nation today and hear the music as it was meant to be.
                        </p>
                        <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '4px' }}>
                            PROTECT THE SIGNAL. JOIN THE TRIBE.
                        </p>
                    </div>
                </section>



                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>INTERFACE PREVIEW</h3>
                    <div className={styles.previewGrid}>
                        {/* 1. Main Play Screen */}
                        <div className={styles.previewCard}>
                            <div className={styles.previewImage}>
                                <img src="/images/cassetto/Main-Screen.jpg" alt="Main Play Screen" />
                            </div>
                            <div className={styles.previewContent}>
                                <h4 className={styles.previewTitle}>Main Play Screen</h4>
                                <p className={styles.previewText}>
                                    Transport Bar with Next/Prev track, FF, RW, Flip Tape & Tape Rack buttons.
                                </p>
                            </div>
                        </div>

                        {/* 2. Downloads Side A */}
                        <div className={styles.previewCard}>
                            <div className={styles.previewImage}>
                                <img src="/images/cassetto/support-artist2.jpg" alt="Downloads Side A" />
                            </div>
                            <div className={styles.previewContent}>
                                <h4 className={styles.previewTitle}>Downloads Side A</h4>
                                <p className={styles.previewText}>
                                    Download icon allows the user to “tip” the artist/DJ or just get the track.
                                </p>
                            </div>
                        </div>

                        {/* 3. Downloads Side B */}
                        <div className={styles.previewCard}>
                            <div className={styles.previewImage}>
                                <img src="/images/cassetto/premium-content3.jpg" alt="Downloads Side B" />
                            </div>
                            <div className={styles.previewContent}>
                                <h4 className={styles.previewTitle}>Downloads Side B</h4>
                                <p className={styles.previewText}>
                                    Download icon allow users to buy limited edition tracks and other premium content.
                                </p>
                            </div>
                        </div>

                        {/* 4. Ownership */}
                        <div className={styles.previewCard}>
                            <div className={styles.previewImage}>
                                <img src="/images/cassetto/main-screen2.jpg" alt="Ownership on B side" />
                            </div>
                            <div className={styles.previewContent}>
                                <h4 className={styles.previewTitle}>Digital Scarcity</h4>
                                <p className={styles.previewText}>
                                    Shows your ownership of limited releases on the B side of the Cassetto.
                                </p>
                            </div>
                        </div>

                        {/* 5. Tape Rack */}
                        <div className={styles.previewCard}>
                            <div className={styles.previewImage}>
                                <img src="/images/cassetto/tape-rack2.jpg" alt="Tape Rack" />
                            </div>
                            <div className={styles.previewContent}>
                                <h4 className={styles.previewTitle}>Tape Rack</h4>
                                <p className={styles.previewText}>
                                    Each Cassetto is from one track to an entire album release from an artist or DJ.
                                </p>
                            </div>
                        </div>
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
