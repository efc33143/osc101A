import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params;

    try {
        const track = await prisma.track.findUnique({ where: { id } })
        if (track) {
            try {
                // Delete audio
                const filePath = join(process.cwd(), 'public', track.filePath)
                await unlink(filePath)
                // Delete image if exists
                if (track.imagePath) {
                    const imgPath = join(process.cwd(), 'public', track.imagePath)
                    await unlink(imgPath)
                }
            } catch (e) {
                console.error('Failed to delete file', e)
            }
            await prisma.track.delete({ where: { id } })
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params;

    try {
        // Parse FormData potentially (or JSON fallback, but frontend uses FormData for files)
        const contentType = req.headers.get('content-type') || ''

        let updateData: any = {}

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            updateData.title = formData.get('title') as string
            updateData.description = formData.get('description') as string
            const groupId = formData.get('groupId') as string
            updateData.groupId = groupId || null

            const imageFile = formData.get('imageFile') as File | null
            if (imageFile) {
                const bytes = await imageFile.arrayBuffer()
                const buffer = Buffer.from(bytes)
                const filename = `cover-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
                const uploadDir = join(process.cwd(), 'public', 'uploads')

                const fs = require('fs')
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

                await writeFile(join(uploadDir, filename), buffer)
                updateData.imagePath = `/uploads/${filename}`
            }
        } else {
            const data = await req.json()
            updateData = {
                title: data.title,
                description: data.description,
                groupId: data.groupId || null
            }
        }

        const track = await prisma.track.update({
            where: { id },
            data: updateData
        })
        return NextResponse.json(track)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to update track' }, { status: 500 })
    }
}
