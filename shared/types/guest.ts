export interface Guest {
  id: string
  name: string
  phone: string | null
  created_at?: string
  updated_at?: string
}

export type GuestCreate = Pick<Guest, 'name'> & Partial<Pick<Guest, 'phone'>>
export type GuestUpdate = Partial<Pick<Guest, 'name' | 'phone'>>
