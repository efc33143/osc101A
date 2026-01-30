import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const comments = await prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        include: { track: { select: { title: true } } }
    })
    return NextResponse.json(comments)
}
