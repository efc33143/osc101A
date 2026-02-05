// @ts-ignore
import styles from './TrackDetails.module.css'
import CommentSection from '@/components/CommentSection'

interface Track {
    id: string
    title: string
    groupId: string | null
    imagePath?: string | null
    description?: string | null
    group?: {
        name: string
    } | null
}

interface TrackDetailsProps {
    track: Track | null
}

export default function TrackDetails({ track }: TrackDetailsProps) {
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
                    {track.group ? (
                        <span className={styles.groupBadge}>GROUP: {track.group.name}</span>
                    ) : track.groupId ? (
                        <span className={styles.groupBadge}>GROUP: {track.groupId}</span>
                    ) : null}
                    <h1 className={styles.title}>{track.title}</h1>
                </div>
            </div>

            <div className={styles.description}>
                {track.description || 'NO ADDITIONAL DATA AVAILABLE FOR THIS ENTRY.'}
            </div>

            <CommentSection trackId={track.id} />
        </div>
    )
}
