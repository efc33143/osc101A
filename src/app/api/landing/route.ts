import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    const config = await prisma.siteConfig.findFirst()
    return NextResponse.json(config || { landingImagePath: null })
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `landing-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const uploadDir = join(process.cwd(), 'public', 'uploads')

        const fs = require('fs')
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

        await writeFile(join(uploadDir, filename), buffer)
        const dbPath = `/uploads/${filename}`

        const config = await prisma.siteConfig.upsert({
            where: { id: 1 },
            update: { landingImagePath: dbPath },
            create: { id: 1, landingImagePath: dbPath }
        })

        return NextResponse.json(config)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update landing image' }, { status: 500 })
    }
}
