'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import styles from './Header.module.css'

interface HeaderProps {
    logoPath: string | null
    logoScale: number
    tagline: string
    bannerText: string
    heroImage: string | null
    parallaxImage: string | null
    heroHeight: string
}

export default function Header({
    logoPath,
    logoScale,
    tagline,
    bannerText,
    heroImage,
    parallaxImage,
    heroHeight
}: HeaderProps) {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY))
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className={styles.hero} style={{ height: heroHeight }}>
            {heroImage ? (
                <div
                    className={styles.blurLayer}
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
            ) : (
                parallaxImage && (
                    <div
                        className={styles.parallaxLayer}
                        style={{
                            backgroundImage: `url(${parallaxImage})`,
                            transform: `translate3d(0, ${scrollY * 0.5}px, 0)`
                        }}
                    />
                )
            )}

            <div className={styles.overlay} />

            <Link
                href="/about"
                className={styles.content}
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
                {logoPath ? (
                    <img
                        src={logoPath}
                        alt="Logo"
                        className={styles.logo}
                        style={{ maxHeight: `${400 * (logoScale / 100)}px` }}
                    />
                ) : (
                    <h1 className={styles.fallbackTitle}>ALIVE 2026</h1>
                )}

                <p className={styles.tagline}>{tagline}</p>

                {bannerText && (
                    <div className={styles.banner}>
                        {bannerText}
                    </div>
                )}
            </Link>
        </section>
    )
}
