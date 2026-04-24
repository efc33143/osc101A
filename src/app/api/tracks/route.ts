import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function GET() {
    const tracks = await prisma.track.findMany({
        include: { group: true, tags: true },
        orderBy: { uploadDate: 'desc' }
    })
    return NextResponse.json(tracks)
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const { title, artist, version, description, groupId, filePath, imagePath, tagIds } = body

        if (!filePath || !title) return NextResponse.json({ error: 'File path and Title required' }, { status: 400 })

        const track = await prisma.track.create({
            data: {
                title,
                artist,
                version,
                description,
                filePath,
                imagePath: imagePath || null,
                groupId: groupId || null,
                tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined
            }
        })

        return NextResponse.json(track)
    } catch (error) {
        console.error('Track creation error:', error)
        return NextResponse.json({ error: 'Failed to create track: ' + (error as Error).message }, { status: 500 })
    }
}
