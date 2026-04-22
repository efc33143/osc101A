'use client'

import { useState, useEffect } from 'react'
// @ts-ignore
import styles from './CommentSection.module.css'

interface Comment {
    id: string
    content: string
    createdAt: string
}

export default function CommentSection({ trackId }: { trackId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [content, setContent] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (trackId) {
            fetchComments()
        }
    }, [trackId])

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/tracks/${trackId}/comments`)
            if (res.ok) {
                const data = await res.json()
                setComments(data)
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setStatus('TRANSMITTING...')

        try {
            const res = await fetch(`/api/tracks/${trackId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            })

            if (res.ok) {
                setContent('')
                setStatus('COMMS RECEIVED. AWAITING ADMIN CLEARANCE.')
                setTimeout(() => setStatus(''), 5000)
            } else {
                setStatus('TRANSMISSION FAILED.')
            }
        } catch (error) {
            setStatus('ERROR: LINK UNSTABLE.')
        }
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>SPEAK YOUR MIND</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    className={styles.textarea}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="ENTER TRANSMISSION DATA..."
                />
                <div className={styles.controls}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={!content.trim()}
                    >
                        SEND
                    </button>
                    {status && <span className={styles.status}>{status}</span>}
                </div>
            </form>

            <div className={styles.commentList}>
                {comments.map((c) => (
                    <div key={c.id} className={styles.comment}>
                        <div className={styles.meta}>
                            <span>UNKNOWN SENDER</span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.content}>{c.content}</div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className={styles.empty}>NO PREVIOUS TRANSMISSIONS DETECTED.</div>
                )}
            </div>
        </div>
    )
}
