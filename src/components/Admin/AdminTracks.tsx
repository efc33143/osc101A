'use client'

import { useState, useEffect } from 'react'
import { upload } from '@vercel/blob/client'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminTracksProps {
    tracks: any[]
    groups: any[]
    tags: any[]
    refresh: () => void
}

export default function AdminTracks({ tracks, groups, tags, refresh }: AdminTracksProps) {
    // Form State
    const [trackFile, setTrackFile] = useState<File | null>(null)
    const [trackImage, setTrackImage] = useState<File | null>(null)
    const [trackTitle, setTrackTitle] = useState('')
    const [trackArtist, setTrackArtist] = useState('')
    const [trackVersion, setTrackVersion] = useState('')
    const [trackGroup, setTrackGroup] = useState('')
    const [trackDesc, setTrackDesc] = useState('')
    // Use a Set or Array for multiple selection
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    // Upload State
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    // Edit State
    const [editingTrack, setEditingTrack] = useState<any>(null)
    const [editTrackImage, setEditTrackImage] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const TRACKS_PER_PAGE = 10

    useEffect(() => {
        setCurrentPage(1)
    }, [tracks.length])

    const totalPages = Math.ceil(tracks.length / TRACKS_PER_PAGE)
    const startIndex = (currentPage - 1) * TRACKS_PER_PAGE
    const currentTracks = tracks.slice(startIndex, startIndex + TRACKS_PER_PAGE)

    // Helper to toggle tags
    const toggleTag = (tagId: string, currentTags: string[], setFn: (t: string[]) => void) => {
        if (currentTags.includes(tagId)) {
            setFn(currentTags.filter(id => id !== tagId))
        } else {
            setFn([...currentTags, tagId])
        }
    }

    const handleUploadTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!trackFile || !trackTitle) return

        setUploading(true)
        setProgress(0)
        try {
            // 1. Upload Audio
            console.log('Uploading audio...')
            const newBlob = await upload(trackFile.name, trackFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                onUploadProgress: (progress) => setProgress(progress.percentage)
            })

            // 2. Upload Image (Optional)
            let imagePath = null
            if (trackImage) {
                console.log('Uploading image...')
                const imgBlob = await upload(trackImage.name, trackImage, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                })
                imagePath = imgBlob.url
            }

            // 3. Save to DB
            const res = await fetch('/api/tracks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: trackTitle,
                    artist: trackArtist,
                    version: trackVersion,
                    description: trackDesc,
                    groupId: trackGroup,
                    filePath: newBlob.url,
                    imagePath,
                    tagIds: selectedTags
                })
            })

            if (!res.ok) throw new Error('Upload failed')

            setTrackFile(null)
            setTrackImage(null)
            setTrackTitle('')
            setTrackArtist('')
            setTrackVersion('')
            setTrackDesc('')
            setTrackGroup('')
            setSelectedTags([])
            refresh()
            alert('TRACK UPLOAD SUCCESSFUL')
        } catch (error) {
            console.error(error)
            alert('UPLOAD FAILED: ' + (error as Error).message)
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    const handleDeleteTrack = async (id: string) => {
        if (confirm('PERMANENTLY DELETE TRACK?')) {
            await fetch(`/api/tracks/${id}`, { method: 'DELETE' })
            refresh()
        }
    }

    const handleUpdateTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTrack) return

        try {
            setUploading(true) // Reusing the uploading state for the button feedback if we want, or just let it spin
            
            let newImagePath = undefined;
            if (editTrackImage) {
                const imgBlob = await upload(editTrackImage.name, editTrackImage, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                })
                newImagePath = imgBlob.url
            }

            const tagIds = editingTrack.tags?.map((t: any) => t.id) || []

            const res = await fetch(`/api/tracks/${editingTrack.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingTrack.title,
                    artist: editingTrack.artist || '',
                    version: editingTrack.version || '',
                    description: editingTrack.description || '',
                    groupId: editingTrack.groupId || '',
                    tagIds: tagIds,
                    removeImage: removeImage,
                    imagePath: newImagePath
                }) 
            })

            if (!res.ok) throw new Error('Update failed')

            setEditingTrack(null)
            setEditTrackImage(null)
            setRemoveImage(false)
            refresh()
            alert('TRACK UPDATED SUCCESSFULLY')
        } catch (error) {
            console.error(error)
            alert('UPDATE FAILED: ' + (error as Error).message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className={styles.grid}>
            {/* Upload Form */}
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>UPLOAD TRACK</h2>
                <form onSubmit={handleUploadTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="TRACK TITLE"
                        value={trackTitle}
                        onChange={e => setTrackTitle(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="ARTIST / DJ (OPTIONAL)"
                        value={trackArtist}
                        onChange={e => setTrackArtist(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="VERSION (OPTIONAL)"
                        value={trackVersion}
                        onChange={e => setTrackVersion(e.target.value)}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="DESCRIPTION"
                        value={trackDesc}
                        onChange={e => setTrackDesc(e.target.value)}
                        className={styles.textarea}
                    />
                    <select
                        value={trackGroup}
                        onChange={e => setTrackGroup(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">SELECT GROUP (OPTIONAL)</option>
                        {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>

                    {/* Tag Selection */}
                    <div style={{ border: '1px solid #333', padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--silver)', marginBottom: '0.5rem' }}>TAGS:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {tags.map((t: any) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => toggleTag(t.id, selectedTags, setSelectedTags)}
                                    style={{
                                        background: selectedTags.includes(t.id) ? 'var(--gold)' : 'transparent',
                                        color: selectedTags.includes(t.id) ? 'black' : 'var(--gold)',
                                        border: '1px solid var(--gold)',
                                        padding: '0.2rem 0.5rem',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>AUDIO FILE:</div>
                    <input
                        type="file"
                        onChange={e => setTrackFile(e.target.files?.[0] || null)}
                        style={{ color: 'white' }}
                        accept="audio/*"
                    />

                    <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>COVER ART:</div>
                    <input
                        type="file"
                        onChange={e => setTrackImage(e.target.files?.[0] || null)}
                        style={{ color: 'white' }}
                        accept="image/*"
                    />

                    <button
                        type="submit"
                        className={styles.btn}
                        disabled={uploading}
                        style={{ opacity: uploading ? 0.5 : 1 }}
                    >
                        {uploading ? `UPLOADING ${progress}%` : 'INITIATE UPLOAD'}
                    </button>
                </form>
            </div>

            {/* Track List */}
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>TRACK DATABASE</h2>
                <ul className={styles.list}>
                    {currentTracks.map((t: any) => (
                        <li key={t.id} className={styles.listItem}>
                            {editingTrack?.id === t.id ? (
                                <form onSubmit={handleUpdateTrack} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        value={editingTrack.title}
                                        onChange={e => setEditingTrack({ ...editingTrack, title: e.target.value })}
                                        className={styles.input}
                                        placeholder="TRACK TITLE"
                                    />
                                    <input
                                        value={editingTrack.artist || ''}
                                        onChange={e => setEditingTrack({ ...editingTrack, artist: e.target.value })}
                                        className={styles.input}
                                        placeholder="ARTIST / DJ"
                                    />
                                    <input
                                        value={editingTrack.version || ''}
                                        onChange={e => setEditingTrack({ ...editingTrack, version: e.target.value })}
                                        className={styles.input}
                                        placeholder="VERSION"
                                    />
                                    <textarea
                                        value={editingTrack.description || ''}
                                        onChange={e => setEditingTrack({ ...editingTrack, description: e.target.value })}
                                        className={styles.textarea}
                                        placeholder="DESCRIPTION"
                                        rows={3}
                                    />
                                    <select
                                        value={editingTrack.groupId || ''}
                                        onChange={e => setEditingTrack({ ...editingTrack, groupId: e.target.value })}
                                        className={styles.select}
                                    >
                                        <option value="">NO GROUP</option>
                                        {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>

                                    <div style={{ borderTop: '1px solid #333', paddingTop: '1rem' }}>
                                        <div style={{ color: 'var(--silver)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>COVER ART MANAGEMENT</div>
                                        {editingTrack.imagePath && !removeImage && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <img src={editingTrack.imagePath} alt="Current" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={removeImage}
                                                        onChange={e => setRemoveImage(e.target.checked)}
                                                    />
                                                    <span style={{ color: '#ff4444' }}>DELETE CURRENT IMAGE</span>
                                                </label>
                                            </div>
                                        )}

                                        {!removeImage && (
                                            <>
                                                <div style={{ fontSize: '0.8rem', color: 'gray', marginBottom: '0.2rem' }}>REPLACE / NEW IMAGE:</div>
                                                <input
                                                    type="file"
                                                    onChange={e => setEditTrackImage(e.target.files?.[0] || null)}
                                                    style={{ color: 'white' }}
                                                    accept="image/*"
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Edit Tags */}
                                    <div style={{ border: '1px solid #333', padding: '0.5rem', marginTop: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--silver)', marginBottom: '0.5rem' }}>TAGS:</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {tags.map((tag: any) => {
                                                const isActive = editingTrack.tags?.some((et: any) => et.id === tag.id)
                                                return (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const currentTags = editingTrack.tags || []
                                                            const newTags = isActive
                                                                ? currentTags.filter((ct: any) => ct.id !== tag.id)
                                                                : [...currentTags, tag]
                                                            setEditingTrack({ ...editingTrack, tags: newTags })
                                                        }}
                                                        style={{
                                                            background: isActive ? 'var(--gold)' : 'transparent',
                                                            color: isActive ? 'black' : 'var(--gold)',
                                                            border: '1px solid var(--gold)',
                                                            padding: '0.2rem 0.5rem',
                                                            fontSize: '0.7rem',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className={styles.btn}>SAVE CHANGES</button>
                                        <button onClick={() => { setEditingTrack(null); setRemoveImage(false); setEditTrackImage(null); }} className={styles.btnSecondary}>CANCEL</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {t.imagePath && <img src={t.imagePath} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid var(--gold)' }} />}
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: 'white' }}>
                                                {t.artist && <span style={{ marginRight: '0.3rem', color: 'var(--silver)' }}>{t.artist} -</span>}
                                                {t.title}
                                                {t.version && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--silver)' }}>{t.version}</span>}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--silver)' }}>{t.group?.name || 'NO GROUP'}</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                                                {t.tags?.map((tag: any) => (
                                                    <span key={tag.id} style={{ fontSize: '0.6rem', border: '1px solid #555', padding: '0 0.3rem', borderRadius: '4px', color: '#aaa' }}>
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--gold)', marginRight: '0.5rem', fontWeight: 'bold' }}>PLAYS: {t.playCount || 0}</span>
                                        <button onClick={() => setEditingTrack(t)} className={styles.btnSecondary} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>EDIT</button>
                                        <button onClick={() => handleDeleteTrack(t.id)} className={styles.btnDanger}>DEL</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--grid-line)' }}>
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={styles.btnSecondary}
                            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            &lt; PREV
                        </button>
                        <span style={{ color: 'var(--silver)', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', letterSpacing: '2px' }}>
                            PAGE {currentPage} OF {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={styles.btnSecondary}
                            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            NEXT &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
