'use client'

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

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>
                {selectedGroup ? groupName : 'ALL TRANSMISSIONS'}
                <span style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.5 }}>
                    {tracks.length} TRACKS
                </span>
            </h2>

            <ul className={styles.list} key={`${selectedGroup}-${tracks.length}`}>
                {tracks.map(track => {
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
        </div>
    )
}
