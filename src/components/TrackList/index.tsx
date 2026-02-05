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
}

interface TrackListProps {
    tracks: Track[]
    selectedGroup: string | null
    currentTrack: Track | null
    onSelectTrack: (track: Track) => void
}

export default function TrackList({ tracks, selectedGroup, currentTrack, onSelectTrack }: TrackListProps) {
    const filteredTracks = selectedGroup
        ? tracks.filter(t => t.groupId === selectedGroup)
        : tracks

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>
                {selectedGroup ? 'GROUP ARCHIVE' : 'ALL TRANSMISSIONS'}
                <span style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.5 }}>
                    {filteredTracks.length} TRACKS
                </span>
            </h2>

            <ul className={styles.list}>
                {filteredTracks.map(track => (
                    <li
                        key={track.id}
                        onClick={() => onSelectTrack(track)}
                        className={`${styles.item} ${currentTrack?.id === track.id ? styles.itemActive : ''}`}
                    >
                        {track.imagePath && (
                            <img src={track.imagePath} alt="" className={styles.thumbnail} />
                        )}
                        <span>{track.title}</span>
                        {currentTrack?.id === track.id && (
                            <span className={styles.playingIndicator}>PLAYING</span>
                        )}
                    </li>
                ))}

                {filteredTracks.length === 0 && (
                    <p className={styles.emptyState}>NO DATA AVAILABLE</p>
                )}
            </ul>
        </div>
    )
}
