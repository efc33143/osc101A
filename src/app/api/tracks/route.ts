import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function GET() {
    const tracks = await prisma.track.findMany({
        include: { group: true },
        orderBy: { uploadDate: 'desc' }
    })
    return NextResponse.json(tracks)
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const imageFile = formData.get('imageFile') as File | null
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const groupId = formData.get('groupId') as string

        if (!file || !title) return NextResponse.json({ error: 'File and Title required' }, { status: 400 })

        // Audio Upload
        const filename = `track-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { url: filePath } = await put(filename, file, { access: 'public' })

        // Image Upload (Optional)
        let imagePath = null
        if (imageFile) {
            const imgFilename = `cover-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            const { url } = await put(imgFilename, imageFile, { access: 'public' })
            imagePath = url
        }

        const track = await prisma.track.create({
            data: {
                title,
                description,
                filePath,
                imagePath,
                groupId: groupId || null
            }
        })

        return NextResponse.json(track)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to upload track' }, { status: 500 })
    }
}
