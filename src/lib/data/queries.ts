import { createClient } from '@/lib/supabase/server'

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function getProfileById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getProfiles(search = '', sector = '', city = '') {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('verified', true)
    .order('name', { ascending: true })

  if (search) {
    query = query.or(`name.ilike.%${search}%,business.ilike.%${search}%,bio.ilike.%${search}%`)
  }

  if (sector) {
    query = query.eq('sector', sector)
  }

  if (city) {
    query = query.eq('city', city)
  }

  const { data, error } = await query

  if (error) return []
  return data || []
}

export async function getEvents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .in('status', ['published', 'finished'])
    .order('date', { ascending: true })

  if (error) return []
  return data || []
}

export async function getEventsWithRsvp(userId = '') {
  const supabase = await createClient()
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .in('status', ['published', 'finished'])
    .order('date', { ascending: true })

  if (error || !events) return []

  const { data: attendees } = await supabase
    .from('event_attendees')
    .select('event_id, user_id, rsvp_status')
    .in('event_id', events.map((e: any) => e.id))

  const attendeesCount = new Map<string, number>()
  const userRsvp = new Map<string, string>()

  attendees?.forEach((a: any) => {
    attendeesCount.set(a.event_id, (attendeesCount.get(a.event_id) || 0) + 1)
    if (a.user_id === userId) userRsvp.set(a.event_id, a.rsvp_status)
  })

  return events.map((e: any) => ({
    ...e,
    attendeesCount: attendeesCount.get(e.id) || 0,
    userRsvp: userRsvp.get(e.id) || null,
  }))
}

export async function getEventWithAttendees(id: string) {
  const supabase = await createClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) return null

  const { data: attendees } = await supabase
    .from('event_attendees')
    .select('*, profiles:user_id (id, name, photo_url, business)')
    .eq('event_id', id)

  return { ...event, attendees: attendees || [] }
}

export async function getFeedPosts(limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}

export async function getCollaborationPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collaboration_posts')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getConnections(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('connections')
    .select('*, requester:requester_id (id, name, photo_url, business, color, user_id), requested:requested_id (id, name, photo_url, business, color, user_id)')
    .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
    .eq('status', 'accepted')

  if (error) return []
  return data || []
}

export async function getPendingConnections(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('connections')
    .select('*, requester:requester_id (id, name, photo_url, business, color, user_id)')
    .eq('requested_id', userId)
    .eq('status', 'pending')

  if (error) return []
  return data || []
}

export async function getPartners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) return []
  return data || []
}

export async function getAchievements() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getNotifications(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getUnreadNotificationsCount(userId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) return 0
  return count || 0
}

export async function getPartnerById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getMetrics() {
  const supabase = await createClient()

  const [profiles, events, connections, partners, feedPosts, collaborations, sponsorships] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('connections').select('*', { count: 'exact', head: true }),
    supabase.from('partners').select('*', { count: 'exact', head: true }),
    supabase.from('feed_posts').select('*', { count: 'exact', head: true }),
    supabase.from('collaboration_posts').select('*', { count: 'exact', head: true }),
    supabase.from('sponsorships').select('*', { count: 'exact', head: true }),
  ])

  return {
    members: profiles.count || 0,
    events: events.count || 0,
    connections: connections.count || 0,
    partners: partners.count || 0,
    feedPosts: feedPosts.count || 0,
    collaborations: collaborations.count || 0,
    sponsorships: sponsorships.count || 0,
  }
}

export async function getGroups() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('groups')
    .select('*, profiles:created_by (id, name, photo_url, business, color)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getGroupById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('groups')
    .select('*, profiles:created_by (id, name, photo_url, business, color)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const { data: members } = await supabase
    .from('group_members')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .eq('group_id', id)

  return { ...data, members: members || [] }
}

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getJobs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getEditions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('editions')
    .select('*')
    .order('date', { ascending: false })

  if (error) return []
  return data || []
}

export async function getSpeakers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('speakers')
    .select('*, events:event_id (title, date)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getReferrals() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('referrals')
    .select('*, profiles:user_id (id, name, photo_url, business, color)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getAllMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getInvites() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invites')
    .select('*, inviter:invited_by (name, email)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}
