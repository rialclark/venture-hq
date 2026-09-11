import type { Venture } from '../data/ventures'

export const STORAGE_KEY = 'venture-hq-webhook-url'

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

function buildPayload(venture: Venture) {
  return {
    source: 'venture-hq',
    ventureId: venture.id,
    shortName: venture.shortName,
    name: venture.name,
    botId: venture.botId,
    botName: venture.botName,
    actionLabel: venture.actionLabel,
    nextStep: venture.nextStep ?? null,
    blockers: venture.blockers.map((b) => b.summary),
    requestedAt: new Date().toISOString(),
  }
}

export function buildVenturePrompt(venture: Venture): string {
  const blockers =
    venture.blockers.length > 0
      ? venture.blockers.map((b) => `- ${b.summary}`).join('\n')
      : '- None'
  return [
    `Venture HQ action: ${venture.actionLabel}`,
    `Venture: ${venture.shortName} (${venture.name})`,
    `Bot: ${venture.botName} (${venture.botId})`,
    `Next step: ${venture.nextStep ?? 'None'}`,
    'Blockers:',
    blockers,
  ].join('\n')
}

export async function copyVenturePrompt(venture: Venture): Promise<BridgeResult> {
  const text = buildVenturePrompt(venture)
  try {
    await navigator.clipboard.writeText(text)
    return { ok: true, message: 'Prompt copied' }
  } catch {
    return { ok: false, message: 'Could not copy prompt' }
  }
}

async function postToWebhook(
  url: string,
  body: Record<string, unknown>,
): Promise<BridgeResult> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      return {
        ok: false,
        message: `Webhook failed (${res.status})`,
      }
    }
    return { ok: true, message: 'Sent to webhook' }
  } catch {
    return { ok: false, message: 'Failed to reach webhook' }
  }
}

export async function dispatchVentureAction(
  venture: Venture,
): Promise<BridgeResult> {
  const url = getWebhookUrl()
  if (!url) {
    return { ok: false, message: 'Set webhook in Settings' }
  }
  return postToWebhook(url, buildPayload(venture))
}

export async function pingWebhook(): Promise<BridgeResult> {
  const url = getWebhookUrl()
  if (!url) {
    return { ok: false, message: 'Set webhook in Settings' }
  }
  return postToWebhook(url, {
    source: 'venture-hq',
    type: 'ping',
    requestedAt: new Date().toISOString(),
  })
}
