import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        if (!id) return NextResponse.json({ error: 'Missing track ID' }, { status: 400 })

        const track = await prisma.track.update({
            where: { id },
            data: {
                playCount: {
                    increment: 1
                }
            }
        })
        
        return NextResponse.json({ playCount: track.playCount })
    } catch (error) {
        console.error('Play increment error:', error)
        return NextResponse.json({ error: 'Failed to increment play count' }, { status: 500 })
    }
}
