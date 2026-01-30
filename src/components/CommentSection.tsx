'use client'

import { useState, useEffect } from 'react'

export default function CommentSection({ trackId }: { trackId: string }) {
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        fetchComments()
    }, [trackId])

    const fetchComments = async () => {
        const res = await fetch(`/api/tracks/${trackId}/comments`)
        if (res.ok) setComments(await res.json())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        const res = await fetch(`/api/tracks/${trackId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        })

        if (res.ok) {
            setContent('')
            setStatus('Comms received. Awaiting Admin Clearance.')
            setTimeout(() => setStatus(''), 5000)
            // Do NOT refetch immediately, as it won't show until approved
        }
    }

    return (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>TRANSMISSIONS</h3>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Enter transmission..."
                    style={{ width: '100%', background: 'black', border: '1px solid #444', color: 'white', padding: '1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="submit" style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>SEND</button>
                    {status && <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{status}</span>}
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map((c: any) => (
                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                            UNKOWN USER • {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        <div>{c.content}</div>
                    </div>
                ))}
                {comments.length === 0 && <p style={{ color: '#555' }}>NO TRANSMISSIONS YET.</p>}
            </div>
        </div>
    )
}
