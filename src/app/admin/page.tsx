'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// @ts-ignore
import styles from '@/components/Admin/Admin.module.css'

import AdminNav from '@/components/Admin/AdminNav'
import AdminTracks from '@/components/Admin/AdminTracks'
import AdminGroups from '@/components/Admin/AdminGroups'
import AdminVisuals from '@/components/Admin/AdminVisuals'
import AdminContent from '@/components/Admin/AdminContent'
import AdminTags from '@/components/Admin/AdminTags'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('tracks')
    const [tracks, setTracks] = useState([])
    const [groups, setGroups] = useState([])
    const [tags, setTags] = useState([])
    const [comments, setComments] = useState([])
    const [messages, setMessages] = useState([])
    const [config, setConfig] = useState<any>({})
    const router = useRouter()

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const [tRes, gRes, tgRes, cRes, comRes, msgRes] = await Promise.all([
                fetch('/api/tracks'),
                fetch('/api/groups'),
                fetch('/api/tags'),
                fetch('/api/config'),
                fetch('/api/comments'),
                fetch('/api/contact')
            ])
            if (tRes.ok) setTracks(await tRes.json())
            if (gRes.ok) setGroups(await gRes.json())
            if (tgRes.ok) setTags(await tgRes.json())
            if (comRes.ok) setComments(await comRes.json() || [])
            if (msgRes.ok) setMessages(await msgRes.json() || [])
            if (cRes.ok) setConfig(await cRes.json())
        } catch (e) {
            console.error("Fetch Error:", e)
        }
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>ADMIN CONSOLE</h1>
                <button onClick={() => router.push('/')} className={styles.exitBtn}>EXIT TO SITE</button>
            </header>

            <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'tracks' && (
                <AdminTracks tracks={tracks} groups={groups} tags={tags} refresh={fetchData} />
            )}

            {activeTab === 'groups' && (
                <AdminGroups groups={groups} tracks={tracks} refresh={fetchData} />
            )}

            {activeTab === 'tags' && (
                <AdminTags tags={tags} refresh={fetchData} />
            )}

            {activeTab === 'visuals' && (
                <AdminVisuals config={config} refresh={fetchData} />
            )}

            {activeTab === 'about' && (
                <AdminContent type="about" data={config} refresh={fetchData} />
            )}

            {activeTab === 'comments' && (
                <AdminContent type="comments" items={comments} refresh={fetchData} />
            )}

            {activeTab === 'messages' && (
                <AdminContent type="messages" items={messages} refresh={fetchData} />
            )}
        </div>
    )
}
