'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Footer.module.css'

interface FooterProps {
    footerText: string | null
    socials: {
        instagram: string | null
        tiktok: string | null
        youtube: string | null
        bandcamp: string | null
    }
}

export default function Footer({ footerText, socials }: FooterProps) {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState('')

    const getUrl = (handleOrUrl: string | null, base: string) => {
        if (!handleOrUrl) return null
        if (handleOrUrl.startsWith('http')) return handleOrUrl
        // Remove @ if present
        const handle = handleOrUrl.replace(/^@/, '')
        return `${base}/${handle}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('ENCRYPTING & SENDING...')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message })
            })
            if (res.ok) {
                setStatus('TRANSMISSION SUCCESSFUL')
                setTimeout(() => { setShowModal(false); setStatus(''); setEmail(''); setMessage('') }, 2000)
            } else {
                setStatus('TRANSMISSION FAILED')
            }
        } catch (error) {
            setStatus('ERROR: LINK UNSTABLE')
        }
    }

    const instaUrl = getUrl(socials.instagram, 'https://instagram.com')
    // TikTok Fix: Ensure we use the handle with '@'
    const tiktokHandle = socials.tiktok ? (socials.tiktok.startsWith('@') ? socials.tiktok : `@${socials.tiktok}`) : null
    const tiktokUrl = tiktokHandle ? `https://tiktok.com/${tiktokHandle}` : null

    const youtubeUrl = getUrl(socials.youtube, 'https://youtube.com')
    const bandcampUrl = socials.bandcamp ? (socials.bandcamp.startsWith('http') ? socials.bandcamp : `https://${socials.bandcamp}`) : null

    return (
        <footer className={styles.footer}>
            {footerText && <div className={styles.text}>{footerText}</div>}

            <div className={styles.socials}>
                {instaUrl && <a href={instaUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>INSTAGRAM</a>}
                {tiktokUrl && <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>TIKTOK</a>}
                {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>YOUTUBE</a>}
                {bandcampUrl && <a href={bandcampUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>BANDCAMP</a>}
            </div>

            <button onClick={() => setShowModal(true)} className={styles.contactBtn}>ESTABLISH CONTACT</button>

            <div className={styles.copyright}>© 2026 OSC101 ARCHIVES // SECURE CONNECTION</div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className={styles.closeBtn}>×</button>
                        <h2 className={styles.modalTitle}>SECURE CHANNEL</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="email"
                                placeholder="IDENTIFICATION (EMAIL)"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <textarea
                                placeholder="MESSAGE DATA"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                className={styles.textarea}
                            />
                            <button type="submit" className={styles.submitBtn}>
                                {status || 'INITIATE TRANSMISSION'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    )
}
