import type { Venture } from '../data/ventures'

export const STORAGE_KEY = 'venture-hq-webhook-url'
export const AUTH_STORAGE_KEY = 'venture-hq-webhook-auth'

export type BridgeResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

export function getWebhookUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function getWebhookAuth(): string {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function setWebhookUrl(url: string): BridgeResult {
  const trimmed = url.trim()
  try {
    if (!trimmed) {
      localStorage.removeItem(STORAGE_KEY)
      return { ok: true, message: 'Webhook URL cleared' }
    }
    localStorage.setItem(STORAGE_KEY, trimmed)
    return { ok: true, message: 'Webhook URL saved' }
  } catch {
    return { ok: false, message: 'Could not save webhook URL' }
  }
}

export function setWebhookAuth(value: string): BridgeResult {
  const trimmed = value.trim()
  try {
    if (!trimmed) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return { ok: true, message: 'Authorization cleared' }
    }
    localStorage.setItem(AUTH_STORAGE_KEY, trimmed)
    return { ok: true, message: 'Authorization saved' }
  } catch {
    return { ok: false, message: 'Could not save Authorization' }
  }
}

export function saveWebhookSettings(
  url: string,
  auth: string,
): BridgeResult {
  const urlResult = setWebhookUrl(url)
  if (!urlResult.ok) return urlResult
  const authResult = setWebhookAuth(auth)
  if (!authResult.ok) return authResult
  if (!url.trim() && !auth.trim()) {
    return { ok: true, message: 'Webhook settings cleared' }
  }
  return { ok: true, message: 'Webhook settings saved' }
}

export function getSuggestedAction(venture: Venture): string {
  return (venture.suggestedAction ?? venture.nextStep ?? '').trim()
}

export function buildWorkOrderPrompt(venture: Venture): string {
  const suggested = getSuggestedAction(venture) || 'None'
  const topBlockers =
    venture.blockers.length > 0
      ? venture.blockers
          .slice(0, 3)
          .map((b) => `- ${b.summary}`)
          .join('\n')
      : '- None'

  return [
    `Work order for ${venture.botName}`,
    '',
    `Venture: ${venture.shortName} (${venture.name})`,
    `Suggested action: ${suggested}`,
    `Next step: ${venture.nextStep ?? 'None'}`,
    'Top blockers:',
    topBlockers,
    '',
    'Please take this on and report back with status and any blockers you hit.',
  ].join('\n')
}

function buildPayload(
  venture: Venture,
  message: string,
  suggestedAction?: string,
): Record<string, unknown> {
  const suggested =
    (suggestedAction ?? getSuggestedAction(venture)).trim() || null
  return {
    source: 'venture-hq',
    ventureId: venture.id,
    shortName: venture.shortName,
    name: venture.name,
    botId: venture.botId,
    botName: venture.botName,
    suggestedAction: suggested,
    message: message.trim(),
    nextStep: venture.nextStep ?? null,
    blockers: venture.blockers.map((b) => b.summary),
    requestedAt: new Date().toISOString(),
  }
}

export async function copyText(text: string): Promise<BridgeResult> {
  try {
    await navigator.clipboard.writeText(text)
    return { ok: true, message: 'Copied' }
  } catch {
    return { ok: false, message: 'Could not copy' }
  }
}

export function buildVenturePrompt(venture: Venture): string {
  return buildWorkOrderPrompt(venture)
}

export async function copyVenturePrompt(
  venture: Venture,
): Promise<BridgeResult> {
  return copyText(buildWorkOrderPrompt(venture))
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const auth = getWebhookAuth()
  if (auth) {
    headers.Authorization = auth
  }
  return headers
}

async function postToWebhook(
  url: string,
  body: Record<string, unknown>,
): Promise<BridgeResult> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      return { ok: false, message: 'Failed' }
    }
    return { ok: true, message: 'Sent' }
  } catch {
    return { ok: false, message: 'Failed' }
  }
}

export async function dispatchVentureAction(
  venture: Venture,
  message: string,
  suggestedAction?: string,
): Promise<BridgeResult> {
  const url = getWebhookUrl()
  if (!url) {
    return { ok: false, message: 'Set webhook first' }
  }
  const trimmed = message.trim()
  if (!trimmed) {
    return { ok: false, message: 'Write a message first' }
  }
  return postToWebhook(url, buildPayload(venture, trimmed, suggestedAction))
}

export async function pingWebhook(): Promise<BridgeResult> {
  const url = getWebhookUrl()
  if (!url) {
    return { ok: false, message: 'Set webhook first' }
  }
  return postToWebhook(url, {
    source: 'venture-hq',
    type: 'ping',
    requestedAt: new Date().toISOString(),
  })
}
