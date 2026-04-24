import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { signSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json()

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Check if locked out
        if (user.lockoutUntil && new Date() < user.lockoutUntil) {
            const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - new Date().getTime()) / 60000)
            return NextResponse.json({ error: `Account locked. Try again in ${minutesLeft} minutes.` }, { status: 429 })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            const attempts = user.failedAttempts + 1
            let lockoutUntil = null
            
            if (attempts >= 3) {
                lockoutUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 mins from now
            }
            
            await prisma.user.update({
                where: { id: user.id },
                data: { failedAttempts: attempts, lockoutUntil }
            })

            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Reset failed attempts on success
        if (user.failedAttempts > 0 || user.lockoutUntil) {
            await prisma.user.update({
                where: { id: user.id },
                data: { failedAttempts: 0, lockoutUntil: null }
            })
        }

        // Create session
        const token = await signSession({ id: user.id, username: user.username })

        const response = NextResponse.json({ success: true })
        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
