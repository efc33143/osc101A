'use client'

interface TagFilterProps {
    tags: any[]
    selectedTag: string | null
    onSelectTag: (tagId: string | null) => void
}

export default function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            overflowX: 'auto',
            maxWidth: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>
            <h2 style={{ color: 'var(--silver)', fontSize: '0.8rem', marginRight: '0.5rem', margin: 0, fontWeight: 'normal', display: 'inline', alignSelf: 'center', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>TAGS:</h2>
            <button
                onClick={() => onSelectTag(null)}
                style={{
                    background: 'transparent',
                    color: !selectedTag ? 'var(--gold)' : 'var(--silver)',
                    opacity: !selectedTag ? 1 : 0.5,
                    textShadow: !selectedTag ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                    border: 'none',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                }}
            >
                ALL
            </button>
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    onClick={() => onSelectTag(selectedTag === tag.id ? null : tag.id)}
                    style={{
                        background: 'transparent',
                        color: selectedTag === tag.id ? 'var(--gold)' : 'var(--silver)',
                        opacity: selectedTag === tag.id ? 1 : 0.5,
                        textShadow: selectedTag === tag.id ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                        border: 'none',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    {tag.name}
                </button>
            ))}
        </div>
    )
}
