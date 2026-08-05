export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  photo_url: string | null
  business: string | null
  role: string | null
  sector: string | null
  city: string | null
  bio: string | null
  social_links: Record<string, string> | null
  verified: boolean
  color: string
  is_admin: boolean
  is_partner: boolean
  visibility: 'public' | 'members' | 'private'
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  location: string | null
  host_brand: string | null
  theme: string | null
  cover_image: string | null
  status: 'draft' | 'published' | 'cancelled' | 'finished'
  max_attendees: number | null
  created_at: string
  updated_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  rsvp_status: 'confirmed' | 'declined' | 'waitlist'
  created_at: string
}

export interface Connection {
  id: string
  requester_id: string
  requested_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface CollaborationPost {
  id: string
  user_id: string
  type: 'procuro_socia' | 'procuro_fornecedora' | 'ofereco_mentoria' | 'procuro_investimento' | 'outro'
  title: string
  description: string | null
  sector: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FeedPost {
  id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  status: 'active' | 'inactive' | 'pending'
  website: string | null
  contact_email: string | null
  created_at: string
  updated_at: string
}

export interface Invite {
  id: string
  email: string
  invited_by: string
  status: 'pending' | 'accepted' | 'cancelled'
  created_at: string
  accepted_at: string | null
}

export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Room {
  id: string
  type: 'direct' | 'group'
  name: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  content: string
  read: boolean
  link: string | null
  created_at: string
}
