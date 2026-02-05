// @ts-ignore
import styles from './TrackDetails.module.css'
import CommentSection from '@/components/CommentSection'

interface Track {
    id: string
    title: string
    groupId: string | null
    imagePath?: string | null
    description?: string | null
    tags?: { id: string, name: string }[]
    group?: {
        name: string
    } | null
}

interface TrackDetailsProps {
    track: Track | null
    onAddToQueue: (track: Track) => void
}

export default function TrackDetails({ track, onAddToQueue }: TrackDetailsProps) {
    if (!track) {
        return (
            <div className={styles.emptyState}>
                <div>
                    <h3 style={{ marginBottom: '1rem', color: '#777' }}>WAITING FOR INPUT</h3>
                    <p>SELECT A TRANSMISSION TO DECODE</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {track.imagePath && (
                    <img src={track.imagePath} alt={track.title} className={styles.coverArt} />
                )}
                <div className={styles.meta}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {track.group ? (
                            <span className={styles.groupBadge}>GROUP: {track.group.name}</span>
                        ) : track.groupId ? (
                            <span className={styles.groupBadge}>GROUP: {track.groupId}</span>
                        ) : null}

                        {track.tags?.map(tag => (
                            <span key={tag.id} style={{
                                fontSize: '0.6rem',
                                border: '1px solid var(--gold)',
                                padding: '0.1rem 0.3rem',
                                borderRadius: '4px',
                                color: 'var(--gold)',
                                opacity: 0.8
                            }}>
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    <h1 className={styles.title}>{track.title}</h1>

                    <button
                        onClick={() => onAddToQueue(track)}
                        style={{
                            marginTop: '1rem',
                            background: 'transparent',
                            border: '1px solid var(--gold)',
                            color: 'var(--gold)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            letterSpacing: '1px',
                            transition: 'all 0.2s',
                            width: 'fit-content'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        ADD TO QUEUE
                    </button>
                </div>
            </div>

            <div className={styles.description}>
                {track.description || 'NO ADDITIONAL DATA AVAILABLE FOR THIS ENTRY.'}
            </div>

            <CommentSection trackId={track.id} />
        </div>
    )
}
