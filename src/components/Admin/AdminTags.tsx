'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminTagsProps {
    tags: any[]
    refresh: () => void
}

export default function AdminTags({ tags, refresh }: AdminTagsProps) {
    const [newTag, setNewTag] = useState('')

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTag) return
        const res = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newTag })
        })
        if (res.ok) {
            setNewTag('')
            refresh()
        } else {
            alert('FAILED TO CREATE TAG')
        }
    }

    const handleDeleteTag = async (id: string) => {
        if (confirm('DELETE TAG?')) {
            await fetch(`/api/tags/${id}`, { method: 'DELETE' })
            refresh()
        }
    }

    return (
        <div className={styles.grid}>
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>NEW TAG</h2>
                <form onSubmit={handleCreateTag} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        className={styles.input}
                        placeholder="TAG NAME (e.g. DARK)"
                    />
                    <button type="submit" className={styles.btn}>ADD</button>
                </form>
            </div>

            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>ACTIVE TAGS</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {tags.map((t: any) => (
                        <div key={t.id} style={{
                            background: 'rgba(255, 51, 51, 0.1)',
                            border: '1px solid var(--gold)',
                            padding: '0.5rem 1rem',
                            display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{t.name}</span>
                            <button
                                onClick={() => handleDeleteTag(t.id)}
                                style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
