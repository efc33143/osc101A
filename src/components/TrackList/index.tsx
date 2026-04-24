'use client'

import { useState, useEffect } from 'react'

// @ts-ignore
import styles from './TrackList.module.css'

interface Track {
    id: string
    title: string
    groupId: string | null
    imagePath?: string | null
    description?: string | null
    filePath: string
    group?: { name: string }
}

interface TrackListProps {
    tracks: Track[]
    selectedGroup: string | null
    currentTrack: Track | null
    onSelectTrack: (track: Track) => void
}

export default function TrackList({ tracks, selectedGroup, currentTrack, onSelectTrack }: TrackListProps) {
    // Tracks are already filtered by parent

    // Color hashing for groups
    const getGroupColor = (name: string) => {
        if (!name) return 'var(--gold)'
        const colors = ['#FFD700', '#00FFFF', '#FF00FF', '#00FF00', '#FFA500']
        let hash = 0
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
        return colors[Math.abs(hash) % colors.length]
    }

    const groupName = tracks.find(t => t.groupId === selectedGroup)?.group?.name || 'GROUP ARCHIVE'

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1)
    const TRACKS_PER_PAGE = 10

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedGroup, tracks.length])

    const totalPages = Math.ceil(tracks.length / TRACKS_PER_PAGE)
    const startIndex = (currentPage - 1) * TRACKS_PER_PAGE
    const currentTracks = tracks.slice(startIndex, startIndex + TRACKS_PER_PAGE)

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>
                {selectedGroup ? groupName : 'ALL TRANSMISSIONS'}
                <span style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.5 }}>
                    {tracks.length} TRACKS
                </span>
            </h2>

            <ul className={styles.list} key={`${selectedGroup}-${currentPage}`}>
                {currentTracks.map(track => {
                    const isPlaying = currentTrack?.id === track.id
                    // Only highlight playing if we are actually playing (not just selected)
                    // Re-reading usage: currentTrack IS the playing track. 

                    return (
                        <li
                            key={track.id}
                            onClick={() => onSelectTrack(track)}
                            className={`${styles.item} ${isPlaying ? styles.itemActive : ''}`}
                            style={{
                                borderLeft: track.group?.name ? `3px solid ${getGroupColor(track.group.name)}` : '3px solid transparent'
                            }}
                        >
                            {track.imagePath && (
                                <img src={track.imagePath} alt={`OSC101 Music - ${track.title} - Underground House Transmission`} loading="lazy" className={styles.thumbnail} />
                            )}
                            <span style={{
                                color: isPlaying ? 'var(--gold)' : 'white',
                                fontWeight: isPlaying ? 'bold' : 'normal',
                                textShadow: isPlaying ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                                wordBreak: 'break-word',
                                flex: 1,
                                minWidth: 0
                            }}>
                                {track.title}
                            </span>
                            {isPlaying && (
                                <span className={styles.playingIndicator}>PLAYING</span>
                            )}
                        </li>
                    )
                })}

                {tracks.length === 0 && (
                    <p className={styles.emptyState}>NO DATA AVAILABLE</p>
                )}
            </ul>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={styles.pageBtn}
                    >
                        &lt; PREV
                    </button>
                    <span className={styles.pageInfo}>
                        PAGE {currentPage} OF {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={styles.pageBtn}
                    >
                        NEXT &gt;
                    </button>
                </div>
            )}
        </div>
    )
}
