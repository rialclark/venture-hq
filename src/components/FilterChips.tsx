export type FilterKey = 'all' | 'attention' | 'active'

const chips: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'attention', label: 'Needs attention' },
  { key: 'active', label: 'Active' },
]

export function FilterChips({
  value,
  onChange,
  counts,
}: {
  value: FilterKey
  onChange: (key: FilterKey) => void
  counts: Record<FilterKey, number>
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter ventures">
      {chips.map((chip) => {
        const selected = value === chip.key
        return (
          <button
            key={chip.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(chip.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              selected
                ? 'bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/40'
                : 'bg-surface-800 text-ink-300 ring-1 ring-surface-700 hover:bg-surface-700 hover:text-ink-100'
            }`}
          >
            {chip.label}
            <span className={`ml-1.5 tabular-nums ${selected ? 'text-emerald-300/80' : 'text-ink-400'}`}>
              {counts[chip.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
