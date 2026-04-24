import { useEffect, useRef } from 'react'
// @ts-ignore
import styles from './TrackDetails.module.css'
import CommentSection from '@/components/CommentSection'

interface Track {
    id: string
    title: string
    artist?: string | null
    version?: string | null
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
    onPlay: (track: Track) => void
}

export default function TrackDetails({ track, onAddToQueue, onPlay }: TrackDetailsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number

        // Helper to resize canvas to its display size
        const resize = () => {
            if (canvas.width !== canvas.clientWidth) {
                canvas.width = canvas.clientWidth
            }
            if (canvas.height !== canvas.clientHeight) {
                canvas.height = canvas.clientHeight
            }
        }

        const draw = () => {
            resize()
            animationId = requestAnimationFrame(draw)

            const analyser = (window as any).__audioAnalyser
            const freqData = (window as any).__freqData

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (!analyser || !freqData) {
                // Not initialized or not playing yet
                return
            }

            analyser.getByteFrequencyData(freqData)

            const sampleRate = analyser.context.sampleRate || 44100
            const nyquist = sampleRate / 2
            const binSize = nyquist / freqData.length

            // Limit to 50Hz - 15kHz
            const startBin = Math.max(0, Math.floor(50 / binSize))
            const endBin = Math.min(freqData.length - 1, Math.ceil(15000 / binSize))
            
            const activeBins = endBin - startBin + 1
            const barWidth = (canvas.width / activeBins) * 0.8
            const gap = (canvas.width / activeBins) * 0.2

            for (let i = 0; i < activeBins; i++) {
                const dataIndex = startBin + i
                
                // Raw normalized value (0.0 to 1.0)
                const rawNormalized = freqData[dataIndex] / 255
                
                // Visual EQ: Music follows a pink-noise distribution (bass heavy, treble light).
                // Since we raised maxDecibels to -5 on the Analyser, the bass won't clip.
                // We apply a gentle boost to the highs to keep them reactive.
                const eqMultiplier = 0.9 + (i / activeBins) * 0.6
                let normalized = rawNormalized * eqMultiplier
                
                // Hard cap at 0.98 so it never perfectly squares off against the very top edge
                normalized = Math.min(0.98, normalized)

                // Scale to canvas height
                let barHeight = normalized * canvas.height
                
                // Keep a minimum height for subtle idle visibility
                if (barHeight < 1) barHeight = 1

                const x = i * (barWidth + gap)
                const y = canvas.height - barHeight

                // Subtle red glow
                ctx.fillStyle = `rgba(255, ${Math.max(0, 50 - normalized * 50)}, ${Math.max(0, 50 - normalized * 50)}, ${0.4 + normalized * 0.6})`
                ctx.shadowBlur = 10
                ctx.shadowColor = 'rgba(255, 0, 0, 0.8)'
                
                ctx.fillRect(x, y, barWidth, barHeight)
                
                // Reset shadow to avoid compound performance hits
                ctx.shadowBlur = 0
            }
        }

        draw()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [track]) // re-run if track changes though the loop is mostly independent

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

                    <h1 className={styles.title}>
                        {track.artist && <span style={{ fontSize: '1rem', display: 'block', color: 'var(--silver)', marginBottom: '0.2rem' }}>{track.artist}</span>}
                        {track.title}
                        {track.version && <span style={{ fontSize: '0.9rem', color: 'var(--gold)', marginLeft: '0.5rem', fontWeight: 'normal', opacity: 0.8 }}>{track.version}</span>}
                    </h1>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onPlay(track)}
                            style={{
                                background: 'var(--gold)',
                                border: '1px solid var(--gold)',
                                color: 'black',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                letterSpacing: '1px',
                                fontWeight: 'bold'
                            }}
                        >
                            PLAY TRANSMISSION
                        </button>

                        <button
                            onClick={() => onAddToQueue(track)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--gold)',
                                color: 'var(--gold)',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                letterSpacing: '1px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            ADD TO QUEUE
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.description}>
                {track.description || 'NO ADDITIONAL DATA AVAILABLE FOR THIS ENTRY.'}
            </div>

            <CommentSection trackId={track.id} />

            <canvas 
                ref={canvasRef} 
                style={{
                    width: '100%',
                    height: '200px',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    borderBottom: '1px solid rgba(255, 0, 0, 0.2)',
                    display: 'block',
                    pointerEvents: 'none'
                }} 
            />
        </div>
    )
}
