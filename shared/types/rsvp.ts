export type AttendanceStatus = 'attending' | 'not_attending'

export interface RSVP {
  id: string
  invitation_id: string
  attendance_status: AttendanceStatus
  submitted_at: string
  updated_at?: string
}

export interface RSVPStats {
  total_guests: number
  total_invitations: number
  invitations_opened: number
  attending: number
  not_attending: number
  pending: number
}
