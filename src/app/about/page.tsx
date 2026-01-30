'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function About() {
    const [content, setContent] = useState('Loading transmission...')
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.aboutContent) setContent(data.aboutContent)

                const validImages = []
                if (data.aboutImagePath) validImages.push(data.aboutImagePath)
                if (data.aboutImage2Path) validImages.push(data.aboutImage2Path)
                if (data.aboutImage3Path) validImages.push(data.aboutImage3Path)
                setImages(validImages)
            })
    }, [])

    return (
        <main style={{ minHeight: '100vh', padding: '2rem', background: 'black', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link href="/" style={{ marginBottom: '2rem', color: 'var(--gold)', textDecoration: 'none', border: '1px solid var(--gold)', padding: '0.5rem 1rem' }}>RETURN TO HOME</Link>

            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '2rem', textAlign: 'center' }}>ABOUT OSC101</h1>

                {/* Image Grid */}
                {images.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${images.length}, 1fr)`,
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}>
                        {images.map((img, i) => (
                            <img key={i} src={img} alt={`About ${i + 1}`} style={{ width: '100%', height: 'auto', border: '1px solid var(--gold)', borderRadius: '8px' }} />
                        ))}
                    </div>
                )}

                <div style={{ lineHeight: '1.8', fontSize: '1.2rem', whiteSpace: 'pre-wrap', color: 'var(--silver)', background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    {content}
                </div>
            </div>

            {/* Responsive Styles Injection */}
            <style jsx global>{`
          @media (max-width: 768px) {
              div[style*="display: grid"] {
                  grid-template-columns: 1fr !important;
              }
          }
      `}</style>
        </main>
    )
}
