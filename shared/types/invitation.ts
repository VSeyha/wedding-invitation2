import type { Guest } from './guest'
import type { RSVP } from './rsvp'

export type InvitationStatus = 'active' | 'revoked'

export interface Invitation {
  id: string
  guest_id: string
  token: string
  status: InvitationStatus
  sent_at?: string | null
  opened_at: string | null
  created_at?: string
  guest?: Guest
  rsvp?: RSVP | null
}

export interface PublicInvitationData {
  token: string
  status: InvitationStatus
  guest_name: string
  opened_at: string | null
  rsvp: {
    status: 'attending' | 'not_attending' | null
    submitted_at: string | null
  } | null
}
