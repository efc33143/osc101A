'use client'

import { useState, useEffect } from 'react'
import GroupSelector from '@/components/GroupSelector'
import AudioPlayer from '@/components/AudioPlayer'
import QueueList from '@/components/QueueList'
import styles from './page.module.css'
import TrackList from '@/components/TrackList'
import TrackDetails from '@/components/TrackDetails'
import Header from '@/components/Header'
import CommentSection from '@/components/CommentSection'
import Footer from '@/components/Footer'
import TagFilter from '@/components/TagFilter'
import SystemLogFooter from '@/components/SystemLogFooter'

export default function Home() {
  const [tracks, setTracks] = useState([])
  const [groups, setGroups] = useState([])
  const [tags, setTags] = useState([])

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const [currentTrack, setCurrentTrack] = useState<any>(null) // The track currently playing
  const [selectedTrack, setSelectedTrack] = useState<any>(null) // The track shown in details
  const [queue, setQueue] = useState<any[]>([])

  // Visuals state
  const [landingImage, setLandingImage] = useState<string | null>(null)
  const [logoPath, setLogoPath] = useState<string | null>(null)
  const [parallaxImage, setParallaxImage] = useState<string | null>('/images/earth_moon.png')
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [heroHeight, setHeroHeight] = useState('90vh')
  const [heroBlur, setHeroBlur] = useState(7)
  const [logoScale, setLogoScale] = useState(100)

  const [tagline, setTagline] = useState('HUMAN AFTER ALL')
  const [bannerText, setBannerText] = useState('')

  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      const [tRes, gRes, lRes, tagRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/groups'),
        fetch('/api/config'),
        fetch('/api/tags')
      ])
      if (tRes.ok) setTracks(await tRes.json())
      if (gRes.ok) setGroups(await gRes.json())
      if (tagRes.ok) setTags(await tagRes.json())

      if (lRes.ok) {
        const conf = await lRes.json()
        setConfig(conf)
        if (conf.landingImagePath) setLandingImage(conf.landingImagePath)
        if (conf.logoPath) setLogoPath(conf.logoPath)
        if (conf.logoScale) setLogoScale(conf.logoScale)
        if (conf.parallaxImagePath) setParallaxImage(conf.parallaxImagePath)
        if (conf.tagline) setTagline(conf.tagline)
        if (conf.bannerText) setBannerText(conf.bannerText)
        if (conf.heroHeight) setHeroHeight(conf.heroHeight)
        if (conf.heroBlur !== undefined && conf.heroBlur !== null) setHeroBlur(conf.heroBlur)
        if (conf.heroImagePath) setHeroImage(conf.heroImagePath)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Filter Logic
  const filteredTracks = tracks.filter((t: any) => {
    if (selectedGroup && t.groupId !== selectedGroup) return false
    if (selectedTag && !t.tags?.some((tag: any) => tag.id === selectedTag)) return false
    return true
  })

  // Playback Logic
  const handleViewTrack = (track: any) => {
    // Smart Play: If no track is playing, auto-play this selection
    if (!currentTrack) {
      setCurrentTrack(track)
      setSelectedTrack(track)
    } else {
      // Otherwise just view it (so user can decide to add to queue or play)
      setSelectedTrack(track)
    }
  }

  const handlePlayTrack = (track: any) => {
    setCurrentTrack(track)
    // Also select it so we see details
    setSelectedTrack(track)
  }

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0]
      setQueue(queue.slice(1))
      setCurrentTrack(next)
      // Only change selection if we are viewing the track that just finished? 
      // Actually usually better to just play in background.
      // But user might want to see what's playing. 
      // Let's safe bet: Update selection to what's playing if user hasn't explicitly navigated away?
      // For now simple: Update selection to match playing track is clearer.
      setSelectedTrack(next)
      return
    }

    // Default next behavior (next in filtered list)
    // Find index of current playing track in the filtered list
    const currentIndex = filteredTracks.findIndex((t: any) => t.id === currentTrack?.id)
    if (currentIndex >= 0 && currentIndex < filteredTracks.length - 1) {
      const next = filteredTracks[currentIndex + 1]
      setCurrentTrack(next)
      setSelectedTrack(next)
    }
  }

  const handleQueueRemove = (index: number) => {
    const newQueue = [...queue]
    newQueue.splice(index, 1)
    setQueue(newQueue)
  }

  const handleQueuePlay = (track: any, index: number) => {
    setCurrentTrack(track)
    setSelectedTrack(track)
    handleQueueRemove(index)
  }

  const addToQueue = (track: any) => {
    setQueue([...queue, track])
    // alert('ADDED TO QUEUE') // Removed alert to avoid interruption
  }

  if (loading) return <div className={styles.loading}>LOADING SYSTEM...</div>

  return (
    <div className={styles.main}>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "MusicPlaylist",
                  "name": "OSC101 Transmissions",
                  "description": "Exclusive underground Electro, House, and Trip Hop transmissions.",
                  "numTracks": tracks.length
              })
          }}
      />
      <div className="sr-only">
        OSC101 is a curated platform for independent electronic music, specializing in Breakbeat, House, and Lo-fi Trip Hop.
      </div>
      <Header
        logoPath={logoPath}
        parallaxImage={parallaxImage}
        heroImage={heroImage}
        heroHeight={heroHeight}
        heroBlur={heroBlur}
        tagline={tagline}
        logoScale={logoScale}
        bannerText={bannerText}
      />

      <div className={styles.contentWrapper}>
        <div className={styles.contentInner}>
          <GroupSelector
            groups={groups}
            selectedGroup={selectedGroup}
            onSelect={setSelectedGroup}
          />

          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />

          <div className={styles.gridContainer}>
            <TrackList
              tracks={filteredTracks}
              onSelectTrack={handleViewTrack}
              currentTrack={currentTrack}
              selectedGroup={selectedGroup}
            />
            <TrackDetails
              track={selectedTrack}
              onAddToQueue={addToQueue}
              onPlay={handlePlayTrack}
            />
          </div>
        </div>

      </div>

      <SystemLogFooter />

      <div style={{ position: 'relative' }}>
        {/* Queue Overlay, could be toggleable in future but for now always visible if items exist */}
        <QueueList
          queue={queue}
          currentTrack={currentTrack}
          onRemove={handleQueueRemove}
          onPlay={handleQueuePlay}
        />
        <AudioPlayer
          track={currentTrack}
          onNext={handleNextTrack}
          onPrev={() => { }}
        />
      </div>
    </div>
  )
}
