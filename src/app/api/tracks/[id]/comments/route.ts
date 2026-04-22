import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const comments = await prisma.comment.findMany({
        where: {
            trackId: id,
            approved: true
        },
        orderBy: { createdAt: 'desc' },
        select: { content: true, createdAt: true, id: true, username: true } // Public fields only
    })
    return NextResponse.json(comments)
}

import { sanitize } from '@/lib/sanitize'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const { content } = await req.json()

        // Robust sanitization against XSS, cross-linking, and binary embedding
        const sanitized = sanitize(content)
        if (!sanitized) return NextResponse.json({ error: 'Empty comment' }, { status: 400 })

        const comment = await prisma.comment.create({
            data: {
                content: sanitized,
                username: 'Guest', // Anonymous by default as per request
                trackId: id,
                approved: false // Default to pending
            }
        })

        return NextResponse.json(comment)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
