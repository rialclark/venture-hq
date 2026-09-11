import { useState, type MouseEvent } from 'react'
import { ChevronDown, ClipboardCopy, ExternalLink, MapPin } from 'lucide-react'
import type { Venture } from '../data/ventures'
import {
  buildWorkOrderPrompt,
  copyText,
  dispatchVentureAction,
  getSuggestedAction,
} from '../lib/actionBridge'
import { StatusPill } from './StatusPill'

function suggestLabel(venture: Venture): string {
  const label = venture.actionLabel.trim()
  if (/^suggest\b/i.test(label)) return label
  return `Suggest ${label}`
}

export function VentureCard({
  venture,
  expanded,
  onToggle,
}: {
  venture: Venture
  expanded: boolean
  onToggle: () => void
}) {
  const topBlocker = venture.blockers[0]
  const recent = venture.activity.slice(0, 2)
  const [panelOpen, setPanelOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [suggestedDraft, setSuggestedDraft] = useState('')
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function openSuggestPanel(e: MouseEvent) {
    e.stopPropagation()
    setSuggestedDraft(getSuggestedAction(venture))
    setMessage(buildWorkOrderPrompt(venture))
    setActionStatus(null)
    setPanelOpen(true)
  }

  function closePanel(e?: MouseEvent) {
    e?.stopPropagation()
    setPanelOpen(false)
    setBusy(false)
  }

  async function handleSend(e: MouseEvent) {
    e.stopPropagation()
    setBusy(true)
    setActionStatus('Sending...')
    const result = await dispatchVentureAction(
      venture,
      message,
      suggestedDraft,
    )
    setActionStatus(result.message)
    setBusy(false)
    if (result.ok) {
      setPanelOpen(false)
    }
  }

  async function handleCopy(e: MouseEvent) {
    e.stopPropagation()
    const result = await copyText(message)
    setActionStatus(result.message)
  }

  return (
    <article
      id={`venture-${venture.id}`}
      className={`flex flex-col rounded-2xl border bg-surface-900/90 transition-colors ${
        expanded
          ? 'border-emerald-500/30 shadow-[0_0_0_1px_rgba(110,231,183,0.08)]'
          : 'border-surface-700 hover:border-surface-600'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-3 p-5 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-surface-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300/90 ring-1 ring-surface-700">
                {venture.shortName}
              </span>
              <StatusPill status={venture.status} />
              <span className="text-[11px] uppercase tracking-wide text-ink-400">
                {venture.kind}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-100">
              {venture.name}
            </h3>
            <p className="mt-1 text-sm text-ink-300">{venture.tagline}</p>
          </div>
          <ChevronDown
            className={`mt-1 h-5 w-5 shrink-0 text-ink-400 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </div>

        {topBlocker ? (
          <div className="rounded-xl border border-surface-700/80 bg-surface-850/80 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Top blocker
            </p>
            <p className="mt-1 text-sm text-ink-100">{topBlocker.summary}</p>
            {topBlocker.dueLabel && (
              <p className="mt-1 text-xs text-amber-300/90">{topBlocker.dueLabel}</p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80">
              Top blocker
            </p>
            <p className="mt-1 text-sm text-ink-200">None critical</p>
          </div>
        )}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Recent activity
          </p>
          <ul className="mt-1.5 space-y-1">
            {recent.map((a) => (
              <li key={a.id} className="flex gap-2 text-sm text-ink-200">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" aria-hidden />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </button>

      <div className="border-t border-surface-800 px-5 py-3">
        {!panelOpen ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openSuggestPanel}
              className="rounded-xl bg-emerald-500/90 px-3.5 py-2 text-sm font-semibold text-surface-950 hover:bg-emerald-400"
            >
              {suggestLabel(venture)}
            </button>
          </div>
        ) : (
          <div
            className="space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Suggested action
                <textarea
                  value={suggestedDraft}
                  onChange={(e) => setSuggestedDraft(e.target.value)}
                  rows={2}
                  className="mt-1.5 w-full resize-y rounded-xl border border-surface-700 bg-surface-850 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink-200 placeholder:text-ink-400 focus:border-emerald-500/40 focus:outline-none"
                />
              </label>
              <p className="mt-1 text-[11px] text-ink-400">
                Lightly editable. Your message below is what gets sent.
              </p>
            </div>

            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Your message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="mt-1.5 w-full resize-y rounded-xl border border-surface-700 bg-surface-850 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink-100 placeholder:text-ink-400 focus:border-emerald-500/40 focus:outline-none"
                spellCheck
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={busy}
                className="rounded-xl bg-emerald-500/90 px-3.5 py-2 text-sm font-semibold text-surface-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                Send to {venture.botName}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-xl border border-surface-600 bg-surface-850 px-2.5 py-2 text-xs font-medium text-ink-200 hover:border-surface-500 hover:bg-surface-800 disabled:opacity-60"
              >
                <ClipboardCopy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </button>
              <button
                type="button"
                onClick={closePanel}
                disabled={busy}
                className="rounded-xl border border-transparent px-2.5 py-2 text-xs font-medium text-ink-300 hover:text-ink-100 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {actionStatus && (
          <p className="mt-2 text-xs text-ink-300" role="status">
            {actionStatus}
          </p>
        )}
      </div>

      {expanded && (
        <div className="border-t border-surface-700 px-5 pb-5 pt-4">
          {venture.website && (
            <a
              href={venture.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {venture.website.replace(/^https?:\/\//, '')}
            </a>
          )}

          {venture.nextStep && (
            <div className="mb-4">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Next step
              </p>
              <p className="mt-1 text-sm text-ink-100">{venture.nextStep}</p>
            </div>
          )}

          {venture.blockers.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                All blockers
              </p>
              <ul className="mt-2 space-y-2">
                {venture.blockers.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-lg border border-surface-700 bg-surface-850 px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink-100">{b.summary}</p>
                      {b.critical && (
                        <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-300">
                          Critical
                        </span>
                      )}
                    </div>
                    {b.detail && (
                      <p className="mt-1 text-sm text-ink-300">{b.detail}</p>
                    )}
                    {b.dueLabel && (
                      <p className="mt-1 text-xs text-amber-300/90">{b.dueLabel}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Full activity
            </p>
            <ul className="mt-2 space-y-1.5">
              {venture.activity.map((a) => (
                <li key={a.id} className="flex gap-2 text-sm text-ink-200">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-400" aria-hidden />
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {venture.notes && venture.notes.length > 0 && (
            <div className="mt-4 rounded-lg border border-surface-700/60 bg-surface-850/50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Notes
              </p>
              <ul className="mt-1 space-y-1">
                {venture.notes.map((n, i) => (
                  <li key={i} className="text-sm text-ink-300">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {venture.metrics && venture.metrics.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Metrics
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {venture.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-surface-700 bg-surface-850 px-3 py-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-ink-400">{m.label}</p>
                      {m.isExample && (
                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
                          Example
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-base font-semibold tabular-nums text-ink-100">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
