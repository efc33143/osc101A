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
    heroBlur: number
    parallaxImage: string | null
    heroHeight: string
}

export default function Header({
    logoPath,
    logoScale,
    tagline,
    bannerText,
    heroImage,
    heroBlur,
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
                <img
                    src={heroImage}
                    alt="Hero Background"
                    className={styles.blurLayer}
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        filter: `blur(${heroBlur}px) brightness(0.6)`
                    }}
                />
            ) : (
                parallaxImage && (
                    <img
                        src={parallaxImage}
                        alt="Parallax Background"
                        className={styles.parallaxLayer}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            width: '100%',
                            height: '120%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0,
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
                <div className={styles.logoContainer}>
                    {logoPath ? (
                        <img
                            src={logoPath}
                            alt="Logo"
                            className={styles.logo}
                            style={{ maxHeight: `min(100%, ${400 * (logoScale / 100)}px)` }}
                        />
                    ) : (
                        <h1 className={styles.fallbackTitle}>ALIVE 2026</h1>
                    )}
                </div>

                <div className={styles.textContainer}>
                    <p className={styles.tagline}>{tagline}</p>

                    {bannerText && (
                        <div className={styles.banner}>
                            {bannerText}
                        </div>
                    )}
                </div>
            </Link>
        </section>
    )
}
