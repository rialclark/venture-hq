import { AlertTriangle } from 'lucide-react'
import type { Venture } from '../data/ventures'

export interface OpenBlocker {
  ventureId: string
  ventureName: string
  shortName: string
  blockerId: string
  summary: string
  dueLabel?: string
  critical: boolean
}

export function collectOpenBlockers(ventures: Venture[]): OpenBlocker[] {
  const items: OpenBlocker[] = []
  for (const v of ventures) {
    for (const b of v.blockers) {
      items.push({
        ventureId: v.id,
        ventureName: v.name,
        shortName: v.shortName,
        blockerId: b.id,
        summary: b.summary,
        dueLabel: b.dueLabel,
        critical: b.critical,
      })
    }
  }
  return items.sort((a, b) => Number(b.critical) - Number(a.critical))
}

export function BlockersPanel({
  blockers,
  onSelect,
}: {
  blockers: OpenBlocker[]
  onSelect: (ventureId: string) => void
}) {
  if (blockers.length === 0) {
    return (
      <section className="rounded-2xl border border-surface-700 bg-surface-900/80 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-300">
          <AlertTriangle className="h-4 w-4 text-emerald-400" aria-hidden />
          Needs attention
        </h2>
        <p className="text-sm text-ink-400">No open blockers right now.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-surface-700 bg-surface-900/80 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-300">
        <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden />
        Needs attention
        <span className="ml-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/25">
          {blockers.length}
        </span>
      </h2>
      <ul className="space-y-2">
        {blockers.map((b) => (
          <li key={`${b.ventureId}-${b.blockerId}`}>
            <button
              type="button"
              onClick={() => onSelect(b.ventureId)}
              className="flex w-full items-start gap-3 rounded-xl border border-surface-700/80 bg-surface-850 px-3.5 py-3 text-left transition-colors hover:border-surface-600 hover:bg-surface-800"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  b.critical ? 'bg-rose-400' : 'bg-amber-400'
                }`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {b.shortName}
                  </span>
                  {b.critical && (
                    <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-300">
                      Critical
                    </span>
                  )}
                  {b.dueLabel && (
                    <span className="text-[11px] text-ink-400">{b.dueLabel}</span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-ink-100">{b.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
