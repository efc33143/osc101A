import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    try {
        const { content } = await req.json()

        // Basic sanitization
        const sanitized = content.replace(/<[^>]*>?/gm, "")
        if (!sanitized.trim()) return NextResponse.json({ error: 'Empty comment' }, { status: 400 })

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
