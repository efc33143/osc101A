'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('visuals')
    const [tracks, setTracks] = useState([])
    const [groups, setGroups] = useState([])
    const [comments, setComments] = useState([])
    const [messages, setMessages] = useState([])
    const router = useRouter()

    // Track Form
    const [trackFile, setTrackFile] = useState<File | null>(null)
    const [trackImage, setTrackImage] = useState<File | null>(null)
    const [trackTitle, setTrackTitle] = useState('')
    const [trackGroup, setTrackGroup] = useState('')
    const [trackDesc, setTrackDesc] = useState('')
    const [editingTrack, setEditingTrack] = useState<any>(null)
    const [editTrackImage, setEditTrackImage] = useState<File | null>(null)

    // Group Form
    const [groupName, setGroupName] = useState('')
    const [groupDesc, setGroupDesc] = useState('')
    const [groupFile, setGroupFile] = useState<File | null>(null)
    const [editingGroup, setEditingGroup] = useState<any>(null)
    const [groupTracks, setGroupTracks] = useState<string[]>([])

    // Visuals Form State
    const [config, setConfig] = useState<any>({})
    const [tagline, setTagline] = useState('')
    const [bannerText, setBannerText] = useState('')
    const [heroHeight, setHeroHeight] = useState('')
    const [landingFile, setLandingFile] = useState<File | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoScale, setLogoScale] = useState(100)
    const [parallaxFile, setParallaxFile] = useState<File | null>(null)
    const [heroFile, setHeroFile] = useState<File | null>(null)

    // Footer & Socials State
    const [footerText, setFooterText] = useState('')
    const [instagramUrl, setInstagramUrl] = useState('')
    const [tiktokUrl, setTiktokUrl] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [bandcampUrl, setBandcampUrl] = useState('')

    // About Form State
    const [aboutContent, setAboutContent] = useState('')
    const [aboutFile, setAboutFile] = useState<File | null>(null)
    const [aboutFile2, setAboutFile2] = useState<File | null>(null)
    const [aboutFile3, setAboutFile3] = useState<File | null>(null)

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const [tRes, gRes, cRes, comRes, msgRes] = await Promise.all([
                fetch('/api/tracks'), fetch('/api/groups'), fetch('/api/config'), fetch('/api/comments'), fetch('/api/contact')
            ])
            if (tRes.ok) setTracks(await tRes.json())
            if (gRes.ok) setGroups(await gRes.json())
            if (comRes.ok) setComments(await comRes.json() || [])
            if (msgRes.ok) setMessages(await msgRes.json() || [])

            if (cRes.ok) {
                const conf = await cRes.json()
                setConfig(conf)
                if (conf.tagline) setTagline(conf.tagline)
                if (conf.bannerText) setBannerText(conf.bannerText)
                if (conf.heroHeight) setHeroHeight(conf.heroHeight)
                if (conf.logoScale) setLogoScale(conf.logoScale)
                if (conf.aboutContent) setAboutContent(conf.aboutContent)

                if (conf.footerText) setFooterText(conf.footerText)
                if (conf.instagramUrl) setInstagramUrl(conf.instagramUrl)
                if (conf.tiktokUrl) setTiktokUrl(conf.tiktokUrl)
                if (conf.youtubeUrl) setYoutubeUrl(conf.youtubeUrl)
                if (conf.bandcampUrl) setBandcampUrl(conf.bandcampUrl)
            }
        } catch (e) { console.error("Fetch Error:", e) }
    }

    // --- Handlers ---
    const handleUploadTrack = async (e: React.FormEvent) => {
        e.preventDefault(); if (!trackFile || !trackTitle) return
        const fd = new FormData(); fd.append('file', trackFile); fd.append('title', trackTitle); fd.append('groupId', trackGroup); fd.append('description', trackDesc)
        if (trackImage) fd.append('imageFile', trackImage)
        await fetch('/api/tracks', { method: 'POST', body: fd }); setTrackFile(null); setTrackImage(null); setTrackTitle(''); setTrackDesc(''); setTrackGroup(''); fetchData()
    }

    const handleUpdateVisual = async (field: string, value: File | string) => {
        const fd = new FormData(); fd.append(field, value)
        await fetch('/api/config', { method: 'POST', body: fd }); fetchData(); alert('Updated')
    }
    const handleDeleteVisual = async (field: string) => { if (confirm('Delete this asset?')) await fetch(`/api/config?field=${field}`, { method: 'DELETE' }); fetchData() }

    // Groups Logic
    const handleCreateGroup = async (e: React.FormEvent) => { e.preventDefault(); const fd = new FormData(); fd.append('name', groupName); fd.append('description', groupDesc); if (groupFile) fd.append('file', groupFile); await fetch('/api/groups', { method: 'POST', body: fd }); setGroupName(''); setGroupDesc(''); setGroupFile(null); fetchData() }
    const handleEditGroup = (group: any) => { setEditingGroup(group); setGroupTracks(tracks.filter((t: any) => t.groupId === group.id).map((t: any) => t.id)) }
    const handleSaveGroup = async (e: React.FormEvent) => { e.preventDefault(); if (!editingGroup) return; await fetch('/api/groups', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingGroup.id, name: editingGroup.name, description: editingGroup.description, trackIds: groupTracks }) }); setEditingGroup(null); fetchData() }
    const toggleGroupTrack = (trackId: string) => { if (groupTracks.includes(trackId)) { setGroupTracks(groupTracks.filter(id => id !== trackId)) } else { setGroupTracks([...groupTracks, trackId]) } }

    // About/Track/Comment Logic (Simplified)
    const handleUpdateAbout = async () => { const fd = new FormData(); fd.append('aboutContent', aboutContent); if (aboutFile) fd.append('aboutFile', aboutFile); if (aboutFile2) fd.append('aboutFile2', aboutFile2); if (aboutFile3) fd.append('aboutFile3', aboutFile3); await fetch('/api/config', { method: 'POST', body: fd }); setAboutFile(null); setAboutFile2(null); setAboutFile3(null); fetchData() }
    const handleUpdateTrack = async (e: React.FormEvent) => { e.preventDefault(); if (!editingTrack) return; const fd = new FormData(); fd.append('title', editingTrack.title); fd.append('description', editingTrack.description || ''); fd.append('groupId', editingTrack.groupId || ''); if (editTrackImage) fd.append('imageFile', editTrackImage); await fetch(`/api/tracks/${editingTrack.id}`, { method: 'PUT', body: fd }); setEditingTrack(null); setEditTrackImage(null); fetchData() }
    const handleDeleteTrack = async (id: string) => { if (confirm('Delete?')) { await fetch(`/api/tracks/${id}`, { method: 'DELETE' }); fetchData() } }
    const handleApproveComment = async (id: string) => { await fetch(`/api/comments/${id}`, { method: 'PUT', body: JSON.stringify({ approved: true }) }); fetchData() }
    const handleDeleteComment = async (id: string) => { if (confirm('Delete?')) await fetch(`/api/comments/${id}`, { method: 'DELETE' }); fetchData() }

    const handleDeleteMessage = async (id: string) => { if (confirm('Delete message?')) await fetch(`/api/contact?id=${id}`, { method: 'DELETE' }); fetchData() }


    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--gold)', paddingBottom: '1rem' }}>
                <h1 style={{ color: 'var(--gold)' }}>ADMIN CONSOLE</h1>
                <button onClick={() => router.push('/')} style={{ background: 'transparent', color: 'var(--silver)', border: '1px solid var(--silver)', padding: '0.5rem 1rem' }}>EXIT TO SITE</button>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['tracks', 'groups', 'visuals', 'about', 'comments', 'messages'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '1rem 2rem', background: activeTab === tab ? 'var(--gold)' : 'transparent',
                        color: activeTab === tab ? 'black' : 'var(--gold)', border: '1px solid var(--gold)', cursor: 'pointer', fontFamily: 'var(--font-heading)', textTransform: 'uppercase'
                    }}>{tab}</button>
                ))}
            </div>

            {/* TRACKS TAB */}
            {activeTab === 'tracks' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                    {/* ... same ... */}
                    <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>UPLOAD TRACK</h2>
                        <form onSubmit={handleUploadTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="TRACK TITLE" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} style={inputStyle} />
                            <textarea placeholder="DESCRIPTION" value={trackDesc} onChange={e => setTrackDesc(e.target.value)} style={inputStyle} />
                            <select value={trackGroup} onChange={e => setTrackGroup(e.target.value)} style={inputStyle}><option value="">SELECT GROUP (OPTIONAL)</option>{groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
                            <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>AUDIO / COVER:</div>
                            <input type="file" onChange={e => setTrackFile(e.target.files?.[0] || null)} style={{ color: 'white' }} accept="audio/*" />
                            <input type="file" onChange={e => setTrackImage(e.target.files?.[0] || null)} style={{ color: 'white' }} accept="image/*" />
                            <button type="submit" style={btnStyle}>UPLOAD</button>
                        </form>
                    </div>
                    <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                        <h2>TRACK LIST</h2>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tracks.map((t: any) => (
                                <li key={t.id} style={{ borderBottom: '1px solid var(--grid-line)', paddingBottom: '1rem' }}>
                                    {editingTrack?.id === t.id ? (
                                        <form onSubmit={handleUpdateTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#220000', padding: '1rem' }}>
                                            <input value={editingTrack.title} onChange={e => setEditingTrack({ ...editingTrack, title: e.target.value })} style={inputStyle} />
                                            <div style={{ display: 'flex', gap: '1rem' }}><button type="submit" style={btnStyle}>SAVE</button><button onClick={() => setEditingTrack(null)} style={{ ...btnStyle, background: 'gray' }}>CANCEL</button></div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>{t.imagePath && <img src={t.imagePath} alt="cover" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />}<div><div style={{ fontWeight: 'bold' }}>{t.title}</div><div style={{ fontSize: '0.8rem', color: 'var(--silver)' }}>{t.group?.name || 'NO GROUP'}</div></div></div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={() => setEditingTrack(t)} style={{ ...btnStyle, fontSize: '0.7rem', padding: '0.5rem' }}>EDIT</button><button onClick={() => handleDeleteTrack(t.id)} style={{ ...btnStyle, background: 'red', fontSize: '0.7rem', padding: '0.5rem' }}>DEL</button></div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* GROUPS TAB */}
            {activeTab === 'groups' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                    {/* ... same ... */}
                    <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>NEW GROUP</h2>
                        <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={groupName} onChange={e => setGroupName(e.target.value)} style={inputStyle} placeholder="NAME" />
                            <button type="submit" style={btnStyle}>CREATE</button>
                        </form>
                    </div>
                    <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                        <h2>GROUPS</h2>
                        <ul style={{ marginTop: '1rem' }}>
                            {groups.map((g: any) => (
                                <li key={g.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                                    {editingGroup?.id === g.id ? (
                                        <form onSubmit={handleSaveGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#220000', padding: '1rem' }}>
                                            <input value={editingGroup.name} onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })} style={inputStyle} />
                                            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #444', padding: '0.5rem' }}>
                                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--silver)' }}>MANAGE TRACKS:</h4>
                                                {tracks.map((t: any) => (
                                                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                                        <input type="checkbox" checked={groupTracks.includes(t.id)} onChange={() => toggleGroupTrack(t.id)} />
                                                        <span style={{ color: groupTracks.includes(t.id) ? 'white' : 'gray' }}>{t.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem' }}><button type="submit" style={btnStyle}>SAVE CHANGES</button><button onClick={() => setEditingGroup(null)} style={{ ...btnStyle, background: 'gray' }}>CANCEL</button></div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div><strong>{g.name}</strong> <span style={{ color: 'gray' }}>({g._count?.tracks || 0} tracks)</span></div>
                                            <button onClick={() => handleEditGroup(g)} style={{ ...btnStyle, fontSize: '0.7rem' }}>EDIT / MANAGE TRACKS</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* VISUALS TAB */}
            {activeTab === 'visuals' && (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: 'var(--gold)' }}>VISUAL ASSET MANAGEMENT</h2>

                    <div style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid var(--gold)', background: 'rgba(0,0,0,0.3)' }}>
                        <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>FOOTER & SOCIALS</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label>FOOTER TEXT</label><input value={footerText} onChange={e => setFooterText(e.target.value)} style={inputStyle} />
                                <button onClick={() => handleUpdateVisual('footerText', footerText)} style={{ ...btnStyle, marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE FOOTER</button></div>

                            {/* Updated Labels for Handles */}
                            <div><label>INSTAGRAM HANDLE (e.g. @name)</label><input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} style={inputStyle} />
                                <button onClick={() => handleUpdateVisual('instagramUrl', instagramUrl)} style={{ ...btnStyle, marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE INSTAGRAM</button></div>

                            <div><label>TIKTOK HANDLE (e.g. @name)</label><input value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} style={inputStyle} />
                                <button onClick={() => handleUpdateVisual('tiktokUrl', tiktokUrl)} style={{ ...btnStyle, marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE TIKTOK</button></div>

                            <div><label>YOUTUBE HANDLE/URL</label><input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={inputStyle} />
                                <button onClick={() => handleUpdateVisual('youtubeUrl', youtubeUrl)} style={{ ...btnStyle, marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE YOUTUBE</button></div>

                            <div><label>BANDCAMP URL</label><input value={bandcampUrl} onChange={e => setBandcampUrl(e.target.value)} style={inputStyle} />
                                <button onClick={() => handleUpdateVisual('bandcampUrl', bandcampUrl)} style={{ ...btnStyle, marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE BANDCAMP</button></div>
                        </div>
                    </div>

                    {/* ... image inputs ... */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[{ l: 'HERO BG', f: 'heroFile', k: 'heroImagePath' }, { l: 'GLOBAL BG', f: 'landingFile', k: 'landingImagePath' }, { l: 'PARALLAX', f: 'parallaxFile', k: 'parallaxImagePath' }, { l: 'LOGO', f: 'logoFile', k: 'logoPath' }].map(item => (
                            <div key={item.f} style={cardStyle}>
                                <h3>{item.l}</h3>
                                {config[item.k] ? <div style={{ color: 'green', fontSize: '0.8rem', margin: '0.5rem 0' }}>ACTIVE</div> : <div style={{ color: 'red', fontSize: '0.8rem', margin: '0.5rem 0' }}>EMPTY</div>}
                                <input type="file" onChange={e => {
                                    if (item.f === 'heroFile') setHeroFile(e.target.files?.[0] || null)
                                    if (item.f === 'landingFile') setLandingFile(e.target.files?.[0] || null)
                                    if (item.f === 'parallaxFile') setParallaxFile(e.target.files?.[0] || null)
                                    if (item.f === 'logoFile') setLogoFile(e.target.files?.[0] || null)
                                }} style={{ color: 'white', margin: '1rem 0' }} />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => {
                                        if (item.f === 'heroFile' && heroFile) handleUpdateVisual('heroFile', heroFile)
                                        if (item.f === 'landingFile' && landingFile) handleUpdateVisual('landingFile', landingFile)
                                        if (item.f === 'parallaxFile' && parallaxFile) handleUpdateVisual('parallaxFile', parallaxFile)
                                        if (item.f === 'logoFile' && logoFile) handleUpdateVisual('logoFile', logoFile)
                                    }} style={{ ...btnStyle, flex: 1 }}>SAVE IMAGE</button>
                                    <button onClick={() => handleDeleteVisual(item.k)} style={{ ...btnStyle, background: 'red', flex: 1 }}>DELETE</button>
                                </div>
                                {item.k === 'logoPath' && (
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--silver)' }}>LOGO SIZE: {logoScale}%</label>
                                        <input type="range" min="50" max="400" value={logoScale} onChange={e => setLogoScale(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
                                        <button onClick={() => handleUpdateVisual('logoScale', logoScale.toString())} style={{ ...btnStyle, width: '100%', marginTop: '0.5rem', fontSize: '0.8rem' }}>SAVE SIZE</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div style={cardStyle}><h3>HERO HEIGHT</h3><div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}><input value={heroHeight} onChange={e => setHeroHeight(e.target.value)} style={inputStyle} /><button onClick={() => handleUpdateVisual('heroHeight', heroHeight)} style={btnStyle}>UPDATE</button></div></div>
                        <div style={cardStyle}><h3>TAGLINE</h3><div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}><input value={tagline} onChange={e => setTagline(e.target.value)} style={inputStyle} /><button onClick={() => handleUpdateVisual('tagline', tagline)} style={btnStyle}>UPDATE</button></div></div>
                        <div style={cardStyle}><h3>BANNER TEXT</h3><div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}><input value={bannerText} onChange={e => setBannerText(e.target.value)} style={inputStyle} /><button onClick={() => handleUpdateVisual('bannerText', bannerText)} style={btnStyle}>UPDATE</button></div></div>
                    </div>
                </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    <h2>ABOUT PAGE</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div><h4>IMAGE 1</h4><input type="file" onChange={e => setAboutFile(e.target.files?.[0] || null)} style={{ color: 'white' }} /></div>
                            <div><h4>IMAGE 2</h4><input type="file" onChange={e => setAboutFile2(e.target.files?.[0] || null)} style={{ color: 'white' }} /></div>
                            <div><h4>IMAGE 3</h4><input type="file" onChange={e => setAboutFile3(e.target.files?.[0] || null)} style={{ color: 'white' }} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleDeleteVisual('aboutImagePath')} style={{ ...btnStyle, background: 'red', fontSize: '0.7rem' }}>DELETE IMG 1</button>
                            <button onClick={() => handleDeleteVisual('aboutImage2Path')} style={{ ...btnStyle, background: 'red', fontSize: '0.7rem' }}>DELETE IMG 2</button>
                            <button onClick={() => handleDeleteVisual('aboutImage3Path')} style={{ ...btnStyle, background: 'red', fontSize: '0.7rem' }}>DELETE IMG 3</button>
                        </div>
                        <textarea value={aboutContent} onChange={e => setAboutContent(e.target.value)} style={{ ...inputStyle, minHeight: '300px' }} />
                        <button onClick={handleUpdateAbout} style={btnStyle}>SAVE ALL</button>
                    </div>
                </div>
            )}

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>USER TRANSMISSIONS (MODERATION)</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead><tr style={{ borderBottom: '1px solid var(--gold)', textAlign: 'left' }}><th style={{ padding: '0.5rem' }}>DATE</th><th style={{ padding: '0.5rem' }}>TRACK</th><th style={{ padding: '0.5rem' }}>CONTENT</th><th style={{ padding: '0.5rem' }}>STATUS</th><th style={{ padding: '0.5rem' }}>ACTION</th></tr></thead>
                        <tbody>
                            {comments.map((c: any) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#888' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.5rem' }}>{c.track?.title}</td>
                                    <td style={{ padding: '0.5rem' }}>{c.content}</td>
                                    <td style={{ padding: '0.5rem', color: c.approved ? 'green' : 'orange' }}>{c.approved ? 'LIVE' : 'PENDING'}</td>
                                    <td style={{ padding: '0.5rem', display: 'flex', gap: '1rem' }}>
                                        {!c.approved && <button onClick={() => handleApproveComment(c.id)} style={{ color: 'green', background: 'transparent', border: '1px solid green', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>APPROVE</button>}
                                        <button onClick={() => handleDeleteComment(c.id)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>DELETE</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {comments.length === 0 && <p>No comments found.</p>}
                </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>CONTACT MESSAGES</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead><tr style={{ borderBottom: '1px solid var(--gold)', textAlign: 'left' }}><th style={{ padding: '0.5rem' }}>DATE</th><th style={{ padding: '0.5rem' }}>EMAIL</th><th style={{ padding: '0.5rem' }}>MESSAGE</th><th style={{ padding: '0.5rem' }}>ACTION</th></tr></thead>
                        <tbody>
                            {messages.map((m: any) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#888' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.5rem' }}>{m.email}</td>
                                    <td style={{ padding: '0.5rem' }}>{m.message}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <button onClick={() => handleDeleteMessage(m.id)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>DELETE</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {messages.length === 0 && <p>No messages received.</p>}
                </div>
            )}
        </div>
    )
}

const inputStyle = { padding: '0.5rem', background: 'black', border: '1px solid var(--silver)', color: 'white', width: '100%', fontFamily: 'var(--font-body)' }
const btnStyle = { padding: '1rem 2rem', background: 'var(--gold)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' as const }
const cardStyle = { padding: '1.5rem', border: '1px solid var(--grid-line)', background: 'rgba(0,0,0,0.5)' }
