'use client'

import { useState } from 'react'
// @ts-ignore
import styles from './Admin.module.css'

export default function AdminSettings() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus(null)

        if (!currentPassword || !newPassword || !confirmPassword) {
            setStatus({ type: 'error', message: 'All fields are required.' })
            return
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match.' })
            return
        }

        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            const data = await res.json()

            if (!res.ok) {
                setStatus({ type: 'error', message: data.error || 'Failed to update password.' })
            } else {
                alert('Password updated successfully. You will now be redirected to log in again.')
                window.location.href = '/admin/login'
            }
        } catch (err) {
            console.error('Password change error:', err)
            setStatus({ type: 'error', message: 'An unexpected error occurred.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.grid}>
            <div className={styles.panel}>
                <h2 className={styles.panelTitle}>SECURITY SETTINGS</h2>
                
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                    
                    {status && (
                        <div style={{
                            padding: '0.8rem',
                            borderRadius: '4px',
                            background: status.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                            color: status.type === 'success' ? '#4ade80' : '#f87171',
                            border: `1px solid ${status.type === 'success' ? '#4ade80' : '#f87171'}`,
                            fontSize: '0.9rem'
                        }}>
                            {status.message}
                        </div>
                    )}

                    <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>CURRENT PASSWORD:</div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className={styles.input}
                    />

                    <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>NEW PASSWORD:</div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className={styles.input}
                    />

                    <div style={{ color: 'var(--silver)', fontSize: '0.8rem' }}>CONFIRM NEW PASSWORD:</div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={styles.input}
                    />

                    <button
                        type="submit"
                        className={styles.btn}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.5 : 1, marginTop: '1rem' }}
                    >
                        {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </button>
                </form>
            </div>
        </div>
    )
}
