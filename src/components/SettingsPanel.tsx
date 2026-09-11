import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  getWebhookAuth,
  getWebhookUrl,
  pingWebhook,
  saveWebhookSettings,
} from '../lib/actionBridge'

export function SettingsPanel({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}) {
  const [url, setUrl] = useState('')
  const [auth, setAuth] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setUrl(getWebhookUrl())
      setAuth(getWebhookAuth())
      setStatus(null)
    }
  }, [open])

  if (!open) return null

  function handleSave() {
    const result = saveWebhookSettings(url, auth)
    setStatus(result.message)
    if (result.ok) onSaved?.()
  }

  async function handlePing() {
    setBusy(true)
    setStatus('Sending...')
    const save = saveWebhookSettings(url, auth)
    if (!save.ok) {
      setStatus(save.message)
      setBusy(false)
      return
    }
    onSaved?.()
    const result = await pingWebhook()
    setStatus(result.message)
    setBusy(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] sm:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-surface-700 bg-surface-900 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="settings-title"
              className="text-lg font-semibold text-ink-100"
            >
              Settings
            </h2>
            <p className="mt-1 text-sm text-ink-300">
              Paste the Boss webhook URL from the Venture HQ Actions routine
              panel. Include the Authorization value if the webhook requires
              it (Bearer token or full header value).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-surface-800 hover:text-ink-200"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400">
          Webhook URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1.5 w-full rounded-xl border border-surface-700 bg-surface-850 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink-100 placeholder:text-ink-400 focus:border-emerald-500/40 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-ink-400">
          Authorization header (optional)
          <input
            type="password"
            value={auth}
            onChange={(e) => setAuth(e.target.value)}
            placeholder="Bearer ... or raw token"
            className="mt-1.5 w-full rounded-xl border border-surface-700 bg-surface-850 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink-100 placeholder:text-ink-400 focus:border-emerald-500/40 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <p className="mt-1.5 text-xs text-ink-400">
          Stored only in this browser. Sent as the Authorization header on
          every webhook POST.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="rounded-xl bg-emerald-500/90 px-3.5 py-2 text-sm font-semibold text-surface-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handlePing}
            disabled={busy}
            className="rounded-xl border border-surface-600 bg-surface-850 px-3.5 py-2 text-sm font-medium text-ink-100 hover:border-surface-500 hover:bg-surface-800 disabled:opacity-60"
          >
            Test ping
          </button>
        </div>

        {status && (
          <p className="mt-3 text-sm text-ink-300" role="status">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
