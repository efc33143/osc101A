import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(tags)
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { name } = await req.json()
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

        const tag = await prisma.tag.create({
            data: { name: name.toUpperCase() }
        })
        return NextResponse.json(tag)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create tag (might already exist)' }, { status: 500 })
    }
}
