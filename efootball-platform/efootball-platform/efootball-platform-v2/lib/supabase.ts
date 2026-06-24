import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  users: {
    id: string
    username: string
    email: string
    avatar_url: string | null
    platform_ids: Record<string, string>
    created_at: string
  }
  teams: {
    id: string
    name: string
    logo_url: string | null
    captain_id: string
    created_at: string
  }
  tournaments: {
    id: string
    name: string
    description: string | null
    format: string
    team_size: number
    max_participants: number
    status: 'upcoming' | 'in_progress' | 'completed'
    prize_info: string | null
    start_date: string | null
    created_by: string
    created_at: string
  }
  matches: {
    id: string
    tournament_id: string
    round: number
    bracket_position: number | null
    team_a_id: string | null
    team_b_id: string | null
    winner_id: string | null
    status: 'scheduled' | 'awaiting_results' | 'disputed' | 'confirmed'
    scheduled_time: string | null
    created_at: string
  }
}
