'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminVisualsProps {
    config: any
    refresh: () => void
}

export default function AdminVisuals({ config, refresh }: AdminVisualsProps) {
    const [footerText, setFooterText] = useState(config.footerText || '')
    const [instagramUrl, setInstagramUrl] = useState(config.instagramUrl || '')
    const [tiktokUrl, setTiktokUrl] = useState(config.tiktokUrl || '')
    const [youtubeUrl, setYoutubeUrl] = useState(config.youtubeUrl || '')
    const [bandcampUrl, setBandcampUrl] = useState(config.bandcampUrl || '')

    // Config State
    const [tagline, setTagline] = useState(config.tagline || '')
    const [bannerText, setBannerText] = useState(config.bannerText || '')
    const [heroHeight, setHeroHeight] = useState(config.heroHeight || '')
    const [logoScale, setLogoScale] = useState(config.logoScale || 100)

    // File State
    const [heroFile, setHeroFile] = useState<File | null>(null)
    const [landingFile, setLandingFile] = useState<File | null>(null)
    const [parallaxFile, setParallaxFile] = useState<File | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const handleUpdate = async (field: string, value: File | string) => {
        const fd = new FormData()
        fd.append(field, value)
        await fetch('/api/config', { method: 'POST', body: fd })
        refresh()
        alert('UPDATED: ' + field)
    }

    const handleDelete = async (field: string) => {
        if (confirm('DELETE ASSET?')) {
            await fetch(`/api/config?field=${field}`, { method: 'DELETE' })
            refresh()
        }
    }

    return (
        <div className={styles.panel}>
            <h2 className={styles.panelTitle}>VISUAL & SOCIAL CONFIGURATION</h2>

            {/* SOCIALS */}
            <div style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid var(--gold)', background: 'rgba(0,0,0,0.3)' }}>
                <h3 style={{ color: 'var(--gold)', marginBottom: '1.5rem', borderBottom: '1px solid #333' }}>COMMUNICATION CHANNELS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <label className={styles.label}>FOOTER TAGLINE</label>
                        <input value={footerText} onChange={e => setFooterText(e.target.value)} className={styles.input} />
                        <button onClick={() => handleUpdate('footerText', footerText)} className={styles.btnSecondary} style={{ marginTop: '0.5rem', width: '100%' }}>SAVE</button>
                    </div>
                    <div>
                        <label className={styles.label}>INSTAGRAM (@handle)</label>
                        <input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} className={styles.input} />
                        <button onClick={() => handleUpdate('instagramUrl', instagramUrl)} className={styles.btnSecondary} style={{ marginTop: '0.5rem', width: '100%' }}>SAVE</button>
                    </div>
                    <div>
                        <label className={styles.label}>TIKTOK (@handle)</label>
                        <input value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} className={styles.input} />
                        <button onClick={() => handleUpdate('tiktokUrl', tiktokUrl)} className={styles.btnSecondary} style={{ marginTop: '0.5rem', width: '100%' }}>SAVE</button>
                    </div>
                    <div>
                        <label className={styles.label}>YOUTUBE (Full URL)</label>
                        <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className={styles.input} />
                        <button onClick={() => handleUpdate('youtubeUrl', youtubeUrl)} className={styles.btnSecondary} style={{ marginTop: '0.5rem', width: '100%' }}>SAVE</button>
                    </div>
                    <div>
                        <label className={styles.label}>BANDCAMP (Full URL)</label>
                        <input value={bandcampUrl} onChange={e => setBandcampUrl(e.target.value)} className={styles.input} />
                        <button onClick={() => handleUpdate('bandcampUrl', bandcampUrl)} className={styles.btnSecondary} style={{ marginTop: '0.5rem', width: '100%' }}>SAVE</button>
                    </div>
                </div>
            </div>

            {/* IMAGES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {[
                    { l: 'HERO BG', f: 'heroFile', k: 'heroImagePath', s: setHeroFile, v: heroFile },
                    { l: 'GLOBAL BG', f: 'landingFile', k: 'landingImagePath', s: setLandingFile, v: landingFile },
                    { l: 'PARALLAX', f: 'parallaxFile', k: 'parallaxImagePath', s: setParallaxFile, v: parallaxFile },
                    { l: 'LOGO', f: 'logoFile', k: 'logoPath', s: setLogoFile, v: logoFile }
                ].map(item => (
                    <div key={item.f} style={{ padding: '1.5rem', border: '1px solid var(--grid-line)', background: 'rgba(0,0,0,0.5)' }}>
                        <h3>{item.l}</h3>
                        {config[item.k] ?
                            <div style={{ color: '#00cc00', fontSize: '0.8rem', margin: '0.5rem 0', fontWeight: 'bold' }}>● ACTIVE</div> :
                            <div style={{ color: '#cc0000', fontSize: '0.8rem', margin: '0.5rem 0', fontWeight: 'bold' }}>● INACTIVE</div>
                        }

                        <input
                            type="file"
                            onChange={e => item.s(e.target.files?.[0] || null)}
                            style={{ color: 'white', margin: '1rem 0', fontSize: '0.9rem' }}
                        />

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => item.v && handleUpdate(item.f, item.v)}
                                className={styles.btn}
                                style={{ flex: 1, fontSize: '0.8rem' }}
                            >
                                UPLOAD
                            </button>
                            <button
                                onClick={() => handleDelete(item.k)}
                                className={styles.btnDanger}
                                style={{ flex: 1 }}
                            >
                                DELETE
                            </button>
                        </div>

                        {item.k === 'logoPath' && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--silver)', marginBottom: '0.5rem', display: 'block' }}>SCALE: {logoScale}%</label>
                                <input
                                    type="range"
                                    min="50"
                                    max="400"
                                    value={logoScale}
                                    onChange={e => setLogoScale(parseInt(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer', marginBottom: '1rem' }}
                                />
                                <button onClick={() => handleUpdate('logoScale', logoScale.toString())} className={styles.btnSecondary} style={{ width: '100%', fontSize: '0.8rem' }}>SAVE SCALE</button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Text Configs */}
                <div style={{ padding: '1.5rem', border: '1px solid var(--grid-line)', background: 'rgba(0,0,0,0.5)' }}>
                    <h3>HEADER CONFIG</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontSize: '0.8rem' }}>HERO HEIGHT (e.g. 90vh)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input value={heroHeight} onChange={e => setHeroHeight(e.target.value)} className={styles.input} />
                            <button onClick={() => handleUpdate('heroHeight', heroHeight)} className={styles.btnSecondary}>UPD</button>
                        </div>

                        <label style={{ fontSize: '0.8rem' }}>TAGLINE</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input value={tagline} onChange={e => setTagline(e.target.value)} className={styles.input} />
                            <button onClick={() => handleUpdate('tagline', tagline)} className={styles.btnSecondary}>UPD</button>
                        </div>

                        <label style={{ fontSize: '0.8rem' }}>BANNER ALERT</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input value={bannerText} onChange={e => setBannerText(e.target.value)} className={styles.input} />
                            <button onClick={() => handleUpdate('bannerText', bannerText)} className={styles.btnSecondary}>UPD</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
