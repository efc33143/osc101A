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
            flexWrap: 'wrap'
        }}>
            <button
                onClick={() => onSelectTag(null)}
                style={{
                    background: !selectedTag ? 'var(--gold)' : 'rgba(0,0,0,0.5)',
                    color: !selectedTag ? 'black' : 'var(--gold)',
                    border: '1px solid var(--gold)',
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
                        background: selectedTag === tag.id ? 'var(--gold)' : 'rgba(0,0,0,0.5)',
                        color: selectedTag === tag.id ? 'black' : 'var(--gold)',
                        border: '1px solid var(--gold)',
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
