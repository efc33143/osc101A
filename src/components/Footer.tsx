'use client'

import { useState } from 'react'

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
        setStatus('SENDING...')
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message })
        })
        if (res.ok) {
            setStatus('TRANSMISSION SENT')
            setTimeout(() => { setShowModal(false); setStatus(''); setEmail(''); setMessage('') }, 2000)
        } else {
            setStatus('ERROR SENDING')
        }
    }

    const instaUrl = getUrl(socials.instagram, 'https://instagram.com')
    // TikTok Fix: Ensure we use the handle with '@'
    const tiktokHandle = socials.tiktok ? (socials.tiktok.startsWith('@') ? socials.tiktok : `@${socials.tiktok}`) : null
    const tiktokUrl = tiktokHandle ? `https://tiktok.com/${tiktokHandle}` : null

    const youtubeUrl = getUrl(socials.youtube, 'https://youtube.com')
    const bandcampUrl = socials.bandcamp ? (socials.bandcamp.startsWith('http') ? socials.bandcamp : `https://${socials.bandcamp}`) : null

    return (
        <footer style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid var(--gold)', textAlign: 'center', color: 'var(--silver)', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', background: 'black', position: 'relative', zIndex: 10 }}>
            {footerText && <div style={{ fontSize: '1rem', letterSpacing: '1px' }}>{footerText}</div>}

            <div style={{ display: 'flex', gap: '2rem' }}>
                {instaUrl && <a href={instaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>INSTAGRAM</a>}
                {tiktokUrl && <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>TIKTOK</a>}
                {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>YOUTUBE</a>}
                {bandcampUrl && <a href={bandcampUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>BANDCAMP</a>}
            </div>

            <button onClick={() => setShowModal(true)} style={{ background: 'transparent', border: '1px solid var(--silver)', color: 'var(--silver)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '1px' }}>CONTACT US</button>

            <div style={{ fontSize: '0.7rem', color: '#555' }}>© 2026 OSC101 ARCHIVES</div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'black', border: '1px solid var(--gold)', padding: '2rem', width: '90%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        <h2 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>CONTACT CHANNEL</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="email" placeholder="YOUR EMAIL" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.5rem', background: '#111', border: '1px solid #333', color: 'white' }} />
                            <textarea placeholder="MESSAGE" value={message} onChange={e => setMessage(e.target.value)} required style={{ padding: '0.5rem', background: '#111', border: '1px solid #333', color: 'white', minHeight: '100px' }} />
                            <button type="submit" style={{ padding: '1rem', background: 'var(--gold)', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{status || 'SEND TRANSMISSION'}</button>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    )
}
