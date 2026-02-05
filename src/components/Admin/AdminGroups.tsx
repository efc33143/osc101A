'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminGroupsProps {
    groups: any[]
    tracks: any[]
    refresh: () => void
}

export default function AdminGroups({ groups, tracks, refresh }: AdminGroupsProps) {
    const [groupName, setGroupName] = useState('')
    const [groupDesc, setGroupDesc] = useState('')
    const [groupFile, setGroupFile] = useState<File | null>(null)

    const [editingGroup, setEditingGroup] = useState<any>(null)
    const [groupTracks, setGroupTracks] = useState<string[]>([])

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('name', groupName)
        fd.append('description', groupDesc)
        if (groupFile) fd.append('file', groupFile)

        await fetch('/api/groups', { method: 'POST', body: fd })
        setGroupName('')
        setGroupDesc('')
        setGroupFile(null)
        refresh()
    }

    const handleEditGroup = (group: any) => {
        setEditingGroup(group)
        setGroupTracks(tracks.filter((t: any) => t.groupId === group.id).map((t: any) => t.id))
    }

    const handleSaveGroup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingGroup) return

        await fetch('/api/groups', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editingGroup.id,
                name: editingGroup.name,
                description: editingGroup.description,
                trackIds: groupTracks
            })
        })
        setEditingGroup(null)
        refresh()
    }

    const toggleGroupTrack = (trackId: string) => {
        if (groupTracks.includes(trackId)) {
            setGroupTracks(groupTracks.filter(id => id !== trackId))
        } else {
            setGroupTracks([...groupTracks, trackId])
        }
    }

    return (
        <div className={styles.grid}>
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>CREATE CLUSTER (GROUP)</h2>
                <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                        className={styles.input}
                        placeholder="GROUP NAME"
                    />
                    <textarea
                        value={groupDesc}
                        onChange={e => setGroupDesc(e.target.value)}
                        className={styles.textarea}
                        placeholder="DESCRIPTION"
                    />
                    <input
                        type="file"
                        onChange={e => setGroupFile(e.target.files?.[0] || null)}
                        style={{ color: 'white' }}
                    />
                    <button type="submit" className={styles.btn}>INITIALIZE GROUP</button>
                </form>
            </div>

            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>ACTIVE CLUSTERS</h2>
                <ul className={styles.list}>
                    {groups.map((g: any) => (
                        <li key={g.id} className={styles.listItem}>
                            {editingGroup?.id === g.id ? (
                                <form onSubmit={handleSaveGroup} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        value={editingGroup.name}
                                        onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })}
                                        className={styles.input}
                                    />
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #444', padding: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--silver)' }}>ASSIGN TRACKS:</h4>
                                        {tracks.map((t: any) => (
                                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={groupTracks.includes(t.id)}
                                                    onChange={() => toggleGroupTrack(t.id)}
                                                    style={{ accentColor: 'var(--gold)' }}
                                                />
                                                <span style={{ color: groupTracks.includes(t.id) ? 'white' : 'gray' }}>{t.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className={styles.btn}>SAVE CONFIG</button>
                                        <button onClick={() => setEditingGroup(null)} className={styles.btnSecondary}>CANCEL</button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong style={{ fontSize: '1.1rem' }}>{g.name}</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'gray' }}>{g._count?.tracks || 0} TRACKS LINKED</div>
                                    </div>
                                    <button onClick={() => handleEditGroup(g)} className={styles.btnSecondary} style={{ fontSize: '0.8rem' }}>MANAGE</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
