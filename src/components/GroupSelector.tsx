'use client'

export default function GroupSelector({ groups, selectedGroup, onSelect }: any) {
    return (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
                onClick={() => onSelect(null)}
                style={{
                    padding: '0.5rem 1rem',
                    background: !selectedGroup ? 'var(--gold)' : 'transparent',
                    color: !selectedGroup ? 'black' : 'var(--gold)',
                    border: '1px solid var(--gold)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase'
                }}
            >
                ALL TRANSMISSIONS
            </button>
            {groups.map((g: any) => (
                <button
                    key={g.id}
                    onClick={() => onSelect(g.id)}
                    style={{
                        padding: '0.5rem 1rem',
                        background: selectedGroup === g.id ? 'var(--gold)' : 'transparent',
                        color: selectedGroup === g.id ? 'black' : 'var(--gold)',
                        border: '1px solid var(--gold)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase'
                    }}
                >
                    {g.name}
                </button>
            ))}
        </div>
    )
}
