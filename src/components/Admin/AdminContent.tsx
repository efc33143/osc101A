'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminContentProps {
    type: 'about' | 'feature' | 'comments' | 'messages'
    data?: any // Config for about or feature
    items?: any[] // Comments or Messages
    refresh: () => void
}

export default function AdminContent({ type, data, items = [], refresh }: AdminContentProps) {
    // About State
    const [aboutContent, setAboutContent] = useState(data?.aboutContent || '')
    const [f1, setF1] = useState<File | null>(null)
    const [f2, setF2] = useState<File | null>(null)
    const [f3, setF3] = useState<File | null>(null)

    // Feature State
    const [featureContent, setFeatureContent] = useState(data?.featureContent || '')
    const [featureStoreLink, setFeatureStoreLink] = useState(data?.featureStoreLink || '')
    const [ff1, setFF1] = useState<File | null>(null)
    const [ff2, setFF2] = useState<File | null>(null)
    const [ff3, setFF3] = useState<File | null>(null)

    const handleUpdateAbout = async () => {
        const fd = new FormData()
        fd.append('aboutContent', aboutContent)
        if (f1) fd.append('aboutFile', f1)
        if (f2) fd.append('aboutFile2', f2)
        if (f3) fd.append('aboutFile3', f3)
        await fetch('/api/config', { method: 'POST', body: fd })
        setF1(null); setF2(null); setF3(null)
        refresh()
        alert('ABOUT PAGE UPDATED')
    }

    const handleUpdateFeature = async () => {
        const fd = new FormData()
        fd.append('featureContent', featureContent)
        fd.append('featureStoreLink', featureStoreLink)
        if (ff1) fd.append('featureFile', ff1)
        if (ff2) fd.append('featureFile2', ff2)
        if (ff3) fd.append('featureFile3', ff3)
        await fetch('/api/config', { method: 'POST', body: fd })
        setFF1(null); setFF2(null); setFF3(null)
        refresh()
        alert('FEATURE PAGE UPDATED')
    }

    const handleDeleteAsset = async (field: string) => {
        if (confirm('Delete?')) {
            await fetch(`/api/config?field=${field}`, { method: 'DELETE' })
            refresh()
        }
    }

    // Comment/Message Actions
    const handleAction = async (id: string, action: 'approve' | 'delete') => {
        if (action === 'delete' && !confirm('Confirm deletion?')) return

        const endpoint = type === 'messages' ? '/api/contact' : `/api/comments/${id}`
        const method = action === 'delete' ? 'DELETE' : 'PUT'
        const body = action === 'approve' ? JSON.stringify({ approved: true }) : (type === 'messages' ? null : null) // DELETE for messages uses query param usually, but checking implementation

        if (type === 'messages' && action === 'delete') {
            await fetch(`/api/contact?id=${id}`, { method: 'DELETE' })
        } else {
            await fetch(endpoint, { method, body })
        }
        refresh()
    }

    if (type === 'about') {
        return (
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>ABOUT PAGE CONTENT</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { l: 'IMG 1', s: setF1, k: 'aboutImagePath' },
                            { l: 'IMG 2', s: setF2, k: 'aboutImage2Path' },
                            { l: 'IMG 3', s: setF3, k: 'aboutImage3Path' }
                        ].map((img, i) => (
                            <div key={i} style={{ padding: '1rem', border: '1px solid #333' }}>
                                <h4>{img.l}</h4>
                                <input type="file" onChange={e => img.s(e.target.files?.[0] || null)} style={{ color: 'white', margin: '0.5rem 0', width: '100%' }} />
                                <button onClick={() => handleDeleteAsset(img.k)} className={styles.btnDanger} style={{ width: '100%' }}>DELETE PREVIOUS</button>
                            </div>
                        ))}
                    </div>
                    <textarea
                        value={aboutContent}
                        onChange={e => setAboutContent(e.target.value)}
                        className={styles.textarea}
                        style={{ minHeight: '300px' }}
                        placeholder="Bio content..."
                    />
                    <button onClick={handleUpdateAbout} className={styles.btn}>SAVE CHANGES</button>
                </div>
            </div>
        )
    }

    if (type === 'feature') {
        return (
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>BANNER FEATURE PAGE CONTENT</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { l: 'IMG 1', s: setFF1, k: 'featureImagePath' },
                            { l: 'IMG 2', s: setFF2, k: 'featureImage2Path' },
                            { l: 'IMG 3', s: setFF3, k: 'featureImage3Path' }
                        ].map((img, i) => (
                            <div key={i} style={{ padding: '1rem', border: '1px solid #333' }}>
                                <h4>{img.l}</h4>
                                <input type="file" onChange={e => img.s(e.target.files?.[0] || null)} style={{ color: 'white', margin: '0.5rem 0', width: '100%' }} />
                                <button onClick={() => handleDeleteAsset(img.k)} className={styles.btnDanger} style={{ width: '100%' }}>DELETE PREVIOUS</button>
                            </div>
                        ))}
                    </div>
                    <input 
                        type="text" 
                        value={featureStoreLink}
                        onChange={e => setFeatureStoreLink(e.target.value)}
                        className={styles.input}
                        placeholder="Store or Destination Link URL..."
                    />
                    <textarea
                        value={featureContent}
                        onChange={e => setFeatureContent(e.target.value)}
                        className={styles.textarea}
                        style={{ minHeight: '300px' }}
                        placeholder="Feature description content..."
                    />
                    <button onClick={handleUpdateFeature} className={styles.btn}>SAVE CHANGES</button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.panel}>
            <h2 className={styles.panelTitle}>{type === 'comments' ? 'USER TRANSMISSIONS (MODERATION)' : 'INCOMING MESSAGES'}</h2>

            {items.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'gray' }}>NO DATA RECEIVED</div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>DATE</th>
                            {type === 'comments' && <th className={styles.th}>TRACK</th>}
                            <th className={styles.th}>{type === 'messages' ? 'SENDER' : 'CONTENT'}</th>
                            {type === 'messages' && <th className={styles.th}>MESSAGE</th>}
                            {type === 'comments' && <th className={styles.th}>STATUS</th>}
                            <th className={styles.th}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any) => (
                            <tr key={item.id}>
                                <td className={styles.td} style={{ fontSize: '0.8rem', color: '#888' }}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                {type === 'comments' && <td className={styles.td}>{item.track?.title}</td>}
                                <td className={styles.td}>{type === 'messages' ? item.email : item.content}</td>
                                {type === 'messages' && <td className={styles.td}>{item.message}</td>}
                                {type === 'comments' && (
                                    <td className={styles.td} style={{ color: item.approved ? '#00cc00' : 'orange' }}>
                                        {item.approved ? 'LIVE' : 'PENDING'}
                                    </td>
                                )}
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {type === 'comments' && !item.approved && (
                                            <button onClick={() => handleAction(item.id, 'approve')} className={styles.btnSecondary} style={{ color: '#00cc00', borderColor: '#00cc00' }}>OK</button>
                                        )}
                                        <button onClick={() => handleAction(item.id, 'delete')} className={styles.btnDanger}>DEL</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
