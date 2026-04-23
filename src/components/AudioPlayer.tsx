'use client'

import { useRef, useState, useEffect } from 'react'

export default function AudioPlayer({ track, onNext, onPrev }: any) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    const currentTrackId = useRef<string | null>(null)

    useEffect(() => {
        if (track && audioRef.current) {
            audioRef.current.src = track.filePath
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => {
                    console.error("Playback failed:", e);
                    setIsPlaying(false);
                })
        }
    }, [track])

    const handlePlay = () => {
        console.log('Audio Engine: PLAYING')
        if (track && currentTrackId.current !== track.id) {
            currentTrackId.current = track.id
            fetch(`/api/tracks/${track.id}/play`, { method: 'POST' }).catch(console.error)
        }
    }

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
            setProgress(p || 0)
            setDuration(audioRef.current.duration)
        }
    }

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds
        }
    }

    if (!track) return null

    return (
        <div style={{
            width: '100%',
            background: 'var(--panel-bg)',
            borderTop: '2px solid var(--gold)',
            padding: '1rem',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ color: 'var(--gold)', fontSize: '1rem' }}>{track.title}</h3>
                    <p style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>{track.group?.name || 'UNKNOWN SOURCE'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={() => skip(-10)} style={btnStyle}>« 10s</button>
                    <button onClick={togglePlay} style={{ ...btnStyle, fontSize: '1rem', padding: '0.5rem 2rem' }}>
                        {isPlaying ? 'PAUSE' : 'PLAY'}
                    </button>
                    <button onClick={() => skip(10)} style={btnStyle}>10s »</button>
                    <button onClick={onNext} style={{ ...btnStyle, borderLeft: '1px solid var(--gold)', marginLeft: '0.5rem' }}>NEXT »|</button>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: '#333', position: 'relative' }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--gold)',
                    boxShadow: '0 0 10px var(--gold)'
                }} />
            </div>

            <audio
                ref={audioRef}
                key={track?.id} // Force re-mount on track change
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onEnded={onNext}
                onPlay={handlePlay}
                onPause={() => console.log('Audio Engine: PAUSED')}
                onError={(e) => console.error('Audio Engine Error:', e.currentTarget.error)}
                onCanPlay={() => console.log('Audio Engine: READY')}
            />
        </div>
    )
}

const btnStyle = {
    background: 'transparent',
    border: '1px solid var(--gold)',
    color: 'var(--gold)',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    textTransform: 'uppercase' as const
}
