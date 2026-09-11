import type { VentureStatus } from '../data/ventures'

const styles: Record<VentureStatus, string> = {
  active:
    'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  blocked:
    'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  parked:
    'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
}

const labels: Record<VentureStatus, string> = {
  active: 'Active',
  blocked: 'Blocked',
  parked: 'Parked',
}

export function StatusPill({ status }: { status: VentureStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
