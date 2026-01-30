import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
    try {
        const { email, message } = await req.json()
        if (!email || !message) return NextResponse.json({ error: 'Email and Message required' }, { status: 400 })

        const newMsg = await prisma.contactMessage.create({
            data: { email, message }
        })
        return NextResponse.json(newMsg)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Primarily for marking as read, but for now we might just use Delete.
    // Let's implement mark read just in case.
    try {
        const { id, read } = await req.json()
        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { read }
        })
        return NextResponse.json(updated)
    } catch (e) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
