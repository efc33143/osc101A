'use client'

import React from 'react'

interface Track {
    id: string
    title: string
    group?: { name: string }
}

interface QueueListProps {
    queue: Track[]
    currentTrack: Track | null
    onRemove: (index: number) => void
    onPlay: (track: Track, index: number) => void
}

export default function QueueList({ queue, currentTrack, onRemove, onPlay }: QueueListProps) {
    if (queue.length === 0) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '120px', // Above the player
            right: '20px',
            background: 'var(--panel-bg)',
            border: '1px solid var(--gold)',
            padding: '1rem',
            width: '300px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 90,
            boxShadow: '0 0 20px rgba(0,0,0,0.8)'
        }}>
            <h3 style={{ borderBottom: '1px solid var(--silver)', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--gold)' }}>
                UP NEXT ({queue.length})
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {queue.map((track, index) => (
                    <li key={`${track.id}-${index}`} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '0.2rem'
                    }}>
                        <div
                            style={{ cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '200px' }}
                            onClick={() => onPlay(track, index)}
                        >
                            <span style={{ color: 'white' }}>{track.title}</span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--silver)' }}>{track.group?.name || 'UNKNOWN'}</div>
                        </div>
                        <button
                            onClick={() => onRemove(index)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ff4444',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                marginLeft: '0.5rem'
                            }}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
