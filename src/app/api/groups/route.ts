import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    const groups = await prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { tracks: true } } }
    })
    return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const formData = await req.formData()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const file = formData.get('file') as File | null

        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        let imagePath = null
        if (file) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filename = `group-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            const uploadDir = join(process.cwd(), 'public', 'uploads')
            const fs = require('fs')
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
            await writeFile(join(uploadDir, filename), buffer)
            imagePath = `/uploads/${filename}`
        }
        const group = await prisma.group.create({ data: { name, slug, description, imagePath } })
        return NextResponse.json(group)
    } catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        const { id, name, description, trackIds } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const data: any = {}
        if (name) data.name = name
        if (description !== undefined) data.description = description

        // Update group basic info
        const group = await prisma.group.update({ where: { id }, data })

        // Update tracks if trackIds provided
        if (trackIds && Array.isArray(trackIds)) {
            // 1. Remove this group from all tracks currently in it (optional, but cleaner ensures we set exactly what is sent)
            // Actually, safer to loop through ALL tracks? No, efficient way:
            // Set all tracks that currently have this groupId to null (remove them)
            await prisma.track.updateMany({
                where: { groupId: id },
                data: { groupId: null }
            })

            // 2. Set the provided trackIds to have this groupId
            if (trackIds.length > 0) {
                await prisma.track.updateMany({
                    where: { id: { in: trackIds } },
                    data: { groupId: id }
                })
            }
        }

        return NextResponse.json(group)
    } catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
