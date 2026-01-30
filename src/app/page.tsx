'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GroupSelector from '@/components/GroupSelector'
import AudioPlayer from '@/components/AudioPlayer'
import CommentSection from '@/components/CommentSection'

export default function Home() {
  const [tracks, setTracks] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [currentTrack, setCurrentTrack] = useState<any>(null)

  // Visuals state
  const [landingImage, setLandingImage] = useState<string | null>(null)
  const [logoPath, setLogoPath] = useState<string | null>(null)
  const [parallaxImage, setParallaxImage] = useState<string | null>('/images/earth_moon.png')
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [heroHeight, setHeroHeight] = useState('90vh')
  const [logoScale, setLogoScale] = useState(100)

  const [tagline, setTagline] = useState('HUMAN AFTER ALL')
  const [bannerText, setBannerText] = useState('')

  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const [tRes, gRes, lRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/groups'),
        fetch('/api/config')
      ])
      if (tRes.ok) setTracks(await tRes.json())
      if (gRes.ok) setGroups(await gRes.json())
      if (lRes.ok) {
        const config = await lRes.json()
        if (config.landingImagePath) setLandingImage(config.landingImagePath)
        if (config.logoPath) setLogoPath(config.logoPath)
        if (config.logoScale) setLogoScale(config.logoScale)
        if (config.parallaxImagePath) setParallaxImage(config.parallaxImagePath)
        if (config.tagline) setTagline(config.tagline)
        if (config.bannerText) setBannerText(config.bannerText)
        if (config.heroHeight) setHeroHeight(config.heroHeight)
        if (config.heroImagePath) setHeroImage(config.heroImagePath)
      }
      setLoading(false)
    }
    fetchData()

    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY))
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredTracks = selectedGroup ? tracks.filter((t: any) => t.groupId === selectedGroup) : tracks

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>INITIALIZING...</div>

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '120px', position: 'relative', overflowX: 'hidden' }}>

      {/* GLOBAL STYLES & ANIMATIONS */}
      <style jsx global>{`
        @keyframes fadeInBlur {
            0% { opacity: 0; filter: blur(10px); }
            100% { opacity: 1; filter: blur(0); }
        }
        .banner-animate {
            animation: fadeInBlur 2s ease-out forwards;
        }

        @media (max-width: 768px) {
            .grid-container { grid-template-columns: 1fr !important; gap: 1rem !important; }
            .hero { height: 70vh !important; }
            /* .logo-img controlled by inline style now */
            h1 { fontSize: 2.5rem !important; }
        }
      `}</style>

      {/* Z-INDEX LAYERS */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: landingImage ? `url(${landingImage})` : 'none',
        backgroundColor: 'black',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        zIndex: 0
      }} />

      {/* Hero Section */}
      <section className="hero" style={{
        height: heroHeight, minHeight: '500px',
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '2rem',
        zIndex: 1
      }}>
        {heroImage ? (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 0,
            filter: 'blur(4px) brightness(0.6)'
          }} />
        ) : (
          parallaxImage && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '120%',
              backgroundImage: `url(${parallaxImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
              zIndex: 0,
              transform: `translate3d(0, ${scrollY * 0.5}px, 0)`, willChange: 'transform'
            }} />
          )
        )}

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 90%)', zIndex: 1 }} />

        <Link href="/about" style={{ zIndex: 2, textAlign: 'center', cursor: 'pointer', transform: `translateY(${scrollY * 0.2}px)` }}>
          {logoPath ? (
            <div style={{ marginBottom: '1rem' }}>
              {/* Resizable Logo (Base 400px) */}
              <img src={logoPath} alt="Logo" className="logo-img" style={{ maxHeight: `${400 * (logoScale / 100)}px`, width: 'auto', display: 'block', margin: '0 auto', marginTop: '1rem' }} />
            </div>
          ) : (
            <h1 style={{ fontSize: '4rem', color: 'var(--gold)', textShadow: '0 0 20px var(--dark-gold)' }}>ALIVE 2026</h1>
          )}
          <p style={{ letterSpacing: '8px', color: 'var(--silver)', marginTop: '0.5rem', textTransform: 'uppercase' }}>{tagline}</p>

          {bannerText && (
            <div className="banner-animate" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,0,0,0.8)', color: 'black', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {bannerText}
            </div>
          )}
        </Link>
      </section>

      {/* Content */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 5,
        background: 'rgba(0,0,0,0.9)', minHeight: '60vh', borderRadius: '12px 12px 0 0', borderTop: '1px solid #333', boxShadow: '0 -10px 50px black'
      }}>
        <div style={{ padding: '3rem 0' }}>
          <GroupSelector groups={groups} selectedGroup={selectedGroup} onSelect={setSelectedGroup} />

          <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: currentTrack ? '1fr 1fr' : '1fr', gap: '3rem' }}>
            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--grid-line)', padding: '2rem' }}>
              <h2 style={{ color: 'var(--gold)', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid var(--grid-line)', paddingBottom: '0.5rem' }}>
                {selectedGroup ? 'GROUP ARCHIVE' : 'ALL TRANSMISSIONS'}
              </h2>
              <ul style={{ listStyle: 'none' }}>
                {filteredTracks.map((t: any) => (
                  <li key={t.id} onClick={() => setCurrentTrack(t)} style={{
                    padding: '1rem', borderBottom: '1px solid var(--grid-line)', cursor: 'pointer',
                    background: currentTrack?.id === t.id ? '#440000' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    transition: 'background 0.2s', color: currentTrack?.id === t.id ? 'var(--gold)' : 'white'
                  }}>
                    {t.imagePath && <img src={t.imagePath} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}
                    <span>{t.title}</span>
                    {currentTrack?.id === t.id && <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>PLAYING</span>}
                  </li>
                ))}
                {filteredTracks.length === 0 && <p style={{ color: '#555', fontStyle: 'italic' }}>NO DATA AVAILABLE</p>}
              </ul>
            </div>

            {currentTrack && (
              <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--gold)', padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  {currentTrack.imagePath && <img src={currentTrack.imagePath} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid var(--gold)' }} />}
                  <h2 style={{ color: 'var(--gold)', fontSize: '2rem', margin: 0 }}>{currentTrack.title}</h2>
                </div>
                <div style={{ color: 'var(--silver)', marginBottom: '2rem', lineHeight: '1.6' }}>{currentTrack.description || 'NO ADDITIONAL DATA'}</div>
                <CommentSection trackId={currentTrack.id} />
              </div>
            )}
          </div>
          {/* Footer removed from here */}
        </div>
      </div>
      <AudioPlayer track={currentTrack} />
    </main>
  )
}
