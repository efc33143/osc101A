import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer'
import prisma from '@/lib/db'

export const metadata: Metadata = {
  title: 'Daft Punk Tribute',
  description: 'Listen to the legends.',
}

export const dynamic = 'force-dynamic'

async function getConfig() {
  try {
    const config = await prisma.siteConfig.findFirst()
    return config
  } catch (e) {
    return null
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getConfig()

  const socials = {
    instagram: config?.instagramUrl || null,
    tiktok: config?.tiktokUrl || null,
    youtube: config?.youtubeUrl || null,
    bandcamp: config?.bandcampUrl || null
  }
  const footerText = config?.footerText || null

  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>{children}</div>
        <Footer footerText={footerText} socials={socials} />
      </body>
    </html>
  )
}
