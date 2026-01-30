'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            router.push('/admin')
        } else {
            const data = await res.json()
            setError(data.error || 'Login failed')
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)'
        }}>
            <div style={{
                padding: '2rem',
                border: '1px solid var(--grid-line)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--gold)' }}>SYSTEM ACCESS</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="USER ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: '1rem',
                            background: 'transparent',
                            border: '1px solid var(--silver)',
                            color: 'var(--foreground)',
                            fontFamily: 'var(--font-heading)'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="ACCESS CODE"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '1rem',
                            background: 'transparent',
                            border: '1px solid var(--silver)',
                            color: 'var(--foreground)',
                            fontFamily: 'var(--font-heading)'
                        }}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'var(--gold)',
                            color: 'black',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase'
                        }}
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    )
}
