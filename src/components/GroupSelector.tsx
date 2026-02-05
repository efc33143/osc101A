'use client'

export default function GroupSelector({ groups, selectedGroup, onSelect }: any) {
    const getGroupColor = (name: string) => {
        if (!name) return 'var(--gold)'
        const colors = ['#FFD700', '#00FFFF', '#FF00FF', '#00FF00', '#FFA500']
        let hash = 0
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
        return colors[Math.abs(hash) % colors.length]
    }

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
            {groups.map((g: any) => {
                const color = getGroupColor(g.name)
                return (
                    <button
                        key={g.id}
                        onClick={() => onSelect(g.id)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: selectedGroup === g.id ? color : 'transparent',
                            color: selectedGroup === g.id ? 'black' : color,
                            border: `1px solid ${color}`,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            boxShadow: selectedGroup === g.id ? `0 0 10px ${color}` : 'none',
                            textShadow: selectedGroup !== g.id ? `0 0 5px ${color}` : 'none'
                        }}
                    >
                        {g.name}
                    </button>
                )
            })}
        </div>
    )
}
