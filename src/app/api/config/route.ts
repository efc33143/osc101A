import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { put, del } from '@vercel/blob'

export async function GET() {
    const config = await prisma.siteConfig.findFirst()
    return NextResponse.json(config || {})
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await req.formData()
        const landingFile = formData.get('landingFile') as File | null
        const logoFile = formData.get('logoFile') as File | null
        const parallaxFile = formData.get('parallaxFile') as File | null
        const heroFile = formData.get('heroFile') as File | null

        const aboutFile = formData.get('aboutFile') as File | null
        const aboutFile2 = formData.get('aboutFile2') as File | null
        const aboutFile3 = formData.get('aboutFile3') as File | null

        const tagline = formData.get('tagline') as string | null
        const bannerText = formData.get('bannerText') as string | null
        const aboutContent = formData.get('aboutContent') as string | null
        const heroHeight = formData.get('heroHeight') as string | null

        const footerText = formData.get('footerText') as string | null
        const instagramUrl = formData.get('instagramUrl') as string | null
        const tiktokUrl = formData.get('tiktokUrl') as string | null
        const youtubeUrl = formData.get('youtubeUrl') as string | null
        const bandcampUrl = formData.get('bandcampUrl') as string | null

        const updateData: any = {}

        const uploadFile = async (file: File, prefix: string) => {
            const filename = `${prefix}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            const { url } = await put(filename, file, { access: 'public' })
            return url
        }

        if (landingFile) updateData.landingImagePath = await uploadFile(landingFile, 'bg')
        if (logoFile) updateData.logoPath = await uploadFile(logoFile, 'logo')
        if (parallaxFile) updateData.parallaxImagePath = await uploadFile(parallaxFile, 'parallax')
        if (heroFile) updateData.heroImagePath = await uploadFile(heroFile, 'hero')
        if (aboutFile) updateData.aboutImagePath = await uploadFile(aboutFile, 'about')
        if (aboutFile2) updateData.aboutImage2Path = await uploadFile(aboutFile2, 'about')
        if (aboutFile3) updateData.aboutImage3Path = await uploadFile(aboutFile3, 'about')

        if (tagline !== null) updateData.tagline = tagline
        if (bannerText !== null) updateData.bannerText = bannerText
        if (aboutContent !== null) updateData.aboutContent = aboutContent
        if (tagline !== null) updateData.tagline = tagline
        if (bannerText !== null) updateData.bannerText = bannerText
        if (aboutContent !== null) updateData.aboutContent = aboutContent
        if (heroHeight !== null) updateData.heroHeight = heroHeight
        const logoScale = formData.get('logoScale')
        if (logoScale) updateData.logoScale = parseInt(logoScale.toString(), 10)

        if (footerText !== null) updateData.footerText = footerText
        if (instagramUrl !== null) updateData.instagramUrl = instagramUrl
        if (tiktokUrl !== null) updateData.tiktokUrl = tiktokUrl
        if (youtubeUrl !== null) updateData.youtubeUrl = youtubeUrl
        if (bandcampUrl !== null) updateData.bandcampUrl = bandcampUrl

        const config = await prisma.siteConfig.upsert({
            where: { id: 1 },
            update: updateData,
            create: { id: 1, ...updateData }
        })

        return NextResponse.json(config)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const field = searchParams.get('field')
    if (!field) return NextResponse.json({ error: 'Field required' }, { status: 400 })

    const allowed = ['landingImagePath', 'logoPath', 'parallaxImagePath', 'heroImagePath', 'aboutImagePath', 'aboutImage2Path', 'aboutImage3Path']
    if (!allowed.includes(field)) return NextResponse.json({ error: 'Invalid field' }, { status: 400 })

    try {
        const config: any = await prisma.siteConfig.findFirst()
        if (config && config[field]) {
            try {
                // Vercel Blob delete logic if we had the URL. 
                // Since this might be an old file URL (filesystem) or new (blob), we try catch.
                // NOTE: @vercel/blob `del` takes the URL string.
                if (config[field].includes('vercel-storage.com')) {
                    await del(config[field])
                }
            } catch (e) { console.error('File delete failed', e) }
        }
        const updated = await prisma.siteConfig.update({ where: { id: 1 }, data: { [field]: null } })
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}
