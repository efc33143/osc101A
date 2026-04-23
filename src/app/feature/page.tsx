'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Feature() {
    const [content, setContent] = useState('Loading transmission...')
    const [storeLink, setStoreLink] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [bannerText, setBannerText] = useState('FEATURE')

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.featureContent) setContent(data.featureContent)
                if (data.featureStoreLink) setStoreLink(data.featureStoreLink)
                if (data.bannerText) setBannerText(data.bannerText)

                const validImages = []
                if (data.featureImagePath) validImages.push(data.featureImagePath)
                if (data.featureImage2Path) validImages.push(data.featureImage2Path)
                if (data.featureImage3Path) validImages.push(data.featureImage3Path)
                setImages(validImages)
            })
    }, [])

    return (
        <main style={{ minHeight: '100vh', padding: '2rem', background: 'black', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link href="/" style={{ marginBottom: '2rem', color: 'var(--gold)', textDecoration: 'none', border: '1px solid var(--gold)', padding: '0.5rem 1rem' }}>RETURN TO HOME</Link>

            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '2rem', textAlign: 'center', wordBreak: 'break-word' }}>
                    {bannerText.toUpperCase()}
                </h1>

                {/* Image Grid */}
                {images.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${images.length}, 1fr)`,
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}>
                        {images.map((img, i) => (
                            <img key={i} src={img} alt={`Feature ${i + 1}`} style={{ width: '100%', height: 'auto', border: '1px solid var(--gold)', borderRadius: '8px' }} />
                        ))}
                    </div>
                )}

                <div style={{ lineHeight: '1.8', fontSize: '1.2rem', whiteSpace: 'pre-wrap', color: 'var(--silver)', background: 'var(--panel-bg)', padding: '2rem', border: '1px solid var(--grid-line)' }}>
                    {content}
                </div>

                {storeLink && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
                        <a 
                            href={storeLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: 'var(--gold)',
                                color: 'black',
                                padding: '1rem 2rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                border: '2px solid var(--gold)',
                                boxShadow: '0 0 20px rgba(255, 1, 0, 0.4)',
                                transition: 'all 0.3s ease',
                                textAlign: 'center'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--gold)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'var(--gold)';
                                e.currentTarget.style.color = 'black';
                            }}
                        >
                            VISIT STORE / DOWNLOAD
                        </a>
                    </div>
                )}
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
