/**
 * Venture HQ seed data.
 * Edit this file to update statuses, blockers, and activity.
 * Do not invent revenue numbers. If you add metrics, set isExample: true.
 */

export type VentureStatus = 'active' | 'blocked' | 'parked'

export interface Blocker {
  id: string
  summary: string
  detail?: string
  dueLabel?: string
  critical: boolean
}

export interface ActivityItem {
  id: string
  text: string
  at?: string
}

export interface Metric {
  label: string
  value: string
  /** Fake or illustrative KPIs must set this true and show an Example badge in UI */
  isExample: boolean
}

export interface Venture {
  id: string
  shortName: string
  name: string
  tagline: string
  website?: string
  kind: string
  status: VentureStatus
  blockers: Blocker[]
  activity: ActivityItem[]
  nextStep?: string
  notes?: string[]
  metrics?: Metric[]
}

/** ISO timestamp used for "Last updated" in the header. Update when you edit this file. */
export const LAST_UPDATED = '2026-09-10T17:58:00-07:00'

export const ventures: Venture[] = [
  {
    id: 'rwh',
    shortName: 'RWH',
    name: 'Riches Who Hustle',
    tagline: 'Marketplace ops across Nifty, Whatnot, and eBay as Rial',
    kind: 'Marketplace',
    status: 'parked',
    blockers: [
      {
        id: 'rwh-offsite',
        summary: 'Parked pending review until Tue Sep 22 9am PT Offsite check-in',
        detail:
          'No open blockers until the Offsite check-in. Promoted Listings remain paused. Promoted Offsite is at $10/day.',
        dueLabel: 'Tue Sep 22, 9:00 AM PT',
        critical: false,
      },
    ],
    activity: [
      {
        id: 'rwh-a1',
        text: 'Promoted Listings paused',
      },
      {
        id: 'rwh-a2',
        text: 'Promoted Offsite raised to $10/day',
      },
    ],
    nextStep: 'Attend Offsite check-in Tue Sep 22 9am PT, then decide resume vs hold.',
  },
  {
    id: 'aya',
    shortName: 'AYA',
    name: 'Above Your Ask',
    tagline: 'Vehicle and high-value brokerage with VA cold outreach',
    website: 'https://aboveyourask.com',
    kind: 'Brokerage',
    status: 'blocked',
    blockers: [
      {
        id: 'aya-aws',
        summary: 'AWS Billing upgrade for closed account 803881282033',
        detail:
          'Root email rialclark@gmail.com. Target is a Windows t3.medium in N. California for the cloud desktop VA workflow.',
        critical: true,
      },
    ],
    activity: [
      {
        id: 'aya-a1',
        text: 'VA hired at roughly $74 to $82 per week',
      },
      {
        id: 'aya-a2',
        text: 'Cloud desktop still blocked on AWS billing',
      },
    ],
    nextStep: 'Complete AWS Billing upgrade, then provision Windows t3.medium in N. California.',
    notes: ['VA cold outreach ready once desktop access is unblocked.'],
  },
  {
    id: 'dkn',
    shortName: 'DKN',
    name: 'DeKlutterNow',
    tagline: 'SoCal cash-for-collectibles',
    website: 'https://deklutternow.com',
    kind: 'Buy / sell',
    status: 'blocked',
    blockers: [
      {
        id: 'dkn-gws',
        summary: 'Google Workspace Admin sign-in as offer@deklutternow.com',
        detail:
          'Needed to finish hello@ migration. Workspace exists on the domain. Gmail and MX still needed. Trial through Sep 22.',
        dueLabel: 'Trial through Sep 22',
        critical: true,
      },
    ],
    activity: [
      {
        id: 'dkn-a1',
        text: 'Workspace exists on domain',
      },
      {
        id: 'dkn-a2',
        text: 'Gmail / MX still needed for hello@ migration',
      },
    ],
    nextStep: 'Sign in as offer@deklutternow.com Admin and finish hello@ migration before trial ends Sep 22.',
  },
  {
    id: 'hti',
    shortName: 'HTI',
    name: 'Curative Title / HTI Home Buyers',
    tagline: 'Tax-delinquent lead ops',
    kind: 'Lead ops',
    status: 'active',
    blockers: [],
    activity: [
      {
        id: 'hti-a1',
        text: 'DataSift Harris niched',
      },
      {
        id: 'hti-a2',
        text: 'Exports curative first-dial 3,774',
      },
      {
        id: 'hti-a3',
        text: 'Money stack up to 12,247',
      },
      {
        id: 'hti-a4',
        text: 'Combined Harris call list about 8,329',
      },
    ],
    nextStep: 'Dialing and OTTO load. No critical blockers.',
    notes: [
      'Counts above are operational list sizes from current exports, not revenue.',
    ],
  },
]
