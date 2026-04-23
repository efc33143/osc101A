'use client'
// @ts-ignore
import styles from './Admin.module.css'

interface AdminNavProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export default function AdminNav({ activeTab, setActiveTab }: AdminNavProps) {
    const tabs = ['tracks', 'groups', 'tags', 'visuals', 'about', 'feature', 'comments', 'messages', 'settings']

    return (
        <div className={styles.nav}>
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={activeTab === tab ? styles.navBtnActive : styles.navBtn}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
