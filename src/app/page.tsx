'use client'

import { useState, useEffect } from 'react'
import GroupSelector from '@/components/GroupSelector'
import AudioPlayer from '@/components/AudioPlayer'
import styles from './page.module.css'
import TrackList from '@/components/TrackList'
import TrackDetails from '@/components/TrackDetails'
import Header from '@/components/Header'

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
  }, [])

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>INITIALIZING...</div>

  return (
    <main className={styles.main}>

      {/* Background Layer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: landingImage ? `url(${landingImage})` : 'none',
        backgroundColor: 'black',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        zIndex: 0
      }} />

      <Header
        logoPath={logoPath}
        logoScale={logoScale}
        tagline={tagline}
        bannerText={bannerText}
        heroImage={heroImage}
        parallaxImage={parallaxImage}
        heroHeight={heroHeight}
      />

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentInner}>
          <GroupSelector groups={groups} selectedGroup={selectedGroup} onSelect={setSelectedGroup} />

          <div className={styles.gridContainer}>
            <TrackList
              tracks={tracks}
              selectedGroup={selectedGroup}
              currentTrack={currentTrack}
              onSelectTrack={setCurrentTrack}
            />

            <TrackDetails track={currentTrack} />
          </div>
        </div>
      </div>

      <AudioPlayer track={currentTrack} />
    </main>
  )
}

