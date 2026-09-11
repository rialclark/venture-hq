import { useMemo, useState } from 'react'
import { LayoutGrid, Settings } from 'lucide-react'
import { LAST_UPDATED, ventures } from './data/ventures'
import { FilterChips, type FilterKey } from './components/FilterChips'
import {
  BlockersPanel,
  collectOpenBlockers,
} from './components/BlockersPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { VentureCard } from './components/VentureCard'

function formatLastUpdated(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

function needsAttention(v: (typeof ventures)[number]): boolean {
  return (
    v.status === 'blocked' ||
    v.blockers.some((b) => b.critical) ||
    (v.status === 'parked' && v.blockers.length > 0)
  )
}

export default function App() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const openBlockers = useMemo(() => collectOpenBlockers(ventures), [])

  const counts = useMemo(
    () => ({
      all: ventures.length,
      attention: ventures.filter(needsAttention).length,
      active: ventures.filter((v) => v.status === 'active').length,
    }),
    [],
  )

  const visible = useMemo(() => {
    if (filter === 'active') return ventures.filter((v) => v.status === 'active')
    if (filter === 'attention') return ventures.filter(needsAttention)
    return ventures
  }, [filter])

  function selectVenture(id: string) {
    setExpandedId(id)
    setFilter('all')
    requestAnimationFrame(() => {
      document.getElementById(`venture-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#161822_0%,_#0a0b0f_55%)]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-surface-700 bg-surface-900/80 px-3 py-1 text-xs text-ink-300">
              <LayoutGrid className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              Multi-venture ops
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
              Venture HQ
            </h1>
            <p className="mt-1 text-sm text-ink-300">
              Rial Clark. All ventures in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-ink-400">
              Last updated{' '}
              <time dateTime={LAST_UPDATED} className="text-ink-200">
                {formatLastUpdated(LAST_UPDATED)}
              </time>
            </p>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-xl border border-surface-700 bg-surface-900/80 p-2 text-ink-300 hover:border-surface-600 hover:text-ink-100"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </header>

        <div className="mb-6">
          <FilterChips value={filter} onChange={setFilter} counts={counts} />
        </div>

        <div className="mb-8">
          <BlockersPanel blockers={openBlockers} onSelect={selectVenture} />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-300">
              Ventures
            </h2>
            <p className="text-xs text-ink-400">
              Showing {visible.length} of {ventures.length}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((v) => (
              <VentureCard
                key={v.id}
                venture={v}
                expanded={expandedId === v.id}
                onToggle={() =>
                  setExpandedId((cur) => (cur === v.id ? null : v.id))
                }
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-surface-700 bg-surface-900/50 px-4 py-10 text-center text-sm text-ink-400">
              No ventures match this filter.
            </p>
          )}
        </section>

        <footer className="mt-12 border-t border-surface-800 pt-6 text-center text-xs text-ink-400">
          Edit seed data in <code className="text-ink-300">src/data/ventures.ts</code>.
          Prefer real status over invented KPIs. Mark any example metrics with{' '}
          <code className="text-ink-300">isExample: true</code>.
        </footer>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
