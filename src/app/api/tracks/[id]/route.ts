import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { put, del } from '@vercel/blob'

// Helper to delete from blob if it's a blob url
async function deleteAsset(url: string | null) {
    if (!url) return
    if (url.includes('blob.vercel-storage.com')) {
        try {
            await del(url)
        } catch (e) {
            console.error('Blob delete failed', e)
        }
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params;

    try {
        const track = await prisma.track.findUnique({ where: { id } })
        if (track) {
            // Delete visuals/audio from blob
            await Promise.all([
                deleteAsset(track.filePath),
                deleteAsset(track.imagePath)
            ])
            await prisma.track.delete({ where: { id } })
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params;

    try {
        const contentType = req.headers.get('content-type') || ''
        let updateData: any = {}

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            updateData.title = formData.get('title') as string
            updateData.description = formData.get('description') as string

            const groupId = formData.get('groupId') as string
            updateData.groupId = groupId && groupId !== '' ? groupId : null

            const removeImage = formData.get('removeImage') === 'true'
            const imageFile = formData.get('imageFile') as File | null

            // Handle Image Updates
            if (removeImage || imageFile) {
                // Fetch old track to delete old image
                const oldTrack = await prisma.track.findUnique({ where: { id }, select: { imagePath: true } })
                if (oldTrack?.imagePath) await deleteAsset(oldTrack.imagePath)

                if (removeImage) {
                    updateData.imagePath = null
                }

                if (imageFile) {
                    const blob = await put(imageFile.name, imageFile, { access: 'public' })
                    updateData.imagePath = blob.url
                }
            }

            const tagIds = formData.get('tagIds') as string
            if (tagIds) {
                const ids = JSON.parse(tagIds)
                updateData.tags = { set: ids.map((id: string) => ({ id })) }
            }

        } else {
            const data = await req.json()
            updateData = {
                title: data.title,
                description: data.description,
                groupId: data.groupId || null,
                tags: data.tagIds ? { set: data.tagIds.map((id: string) => ({ id })) } : undefined
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
