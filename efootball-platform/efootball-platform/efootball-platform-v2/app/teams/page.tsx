import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import { supabase } from '@/lib/supabase'
import { Users, Plus } from 'lucide-react'

async function getTeams() {
  const { data } = await supabase
    .from('teams')
    .select('*, captain:captain_id(username), team_members(count)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function TeamsPage() {
  const teams = await getTeams()

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0 px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-1">Community</p>
            <h1 className="text-3xl font-display font-bold text-chalk">TEAMS</h1>
          </div>
          <Link href="/teams/create" className="btn-primary">
            <Plus size={14} /> Create
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="card text-center py-12">
            <Users size={32} className="text-ash/30 mx-auto mb-3" />
            <p className="text-ash text-sm">No teams yet. Be the first!</p>
            <Link href="/teams/create" className="btn-primary mt-4 inline-flex mx-auto">
              <Plus size={14} /> Create Team
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {teams.map((team: any) => (
              <Link key={team.id} href={`/teams/${team.id}`} className="card hover:border-volt/40 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-pitch border border-pitch-border flex items-center justify-center mb-3">
                  <span className="text-volt font-display font-bold text-xl">{team.name[0].toUpperCase()}</span>
                </div>
                <h3 className="font-display text-lg text-chalk group-hover:text-volt transition-colors truncate">{team.name}</h3>
                <p className="text-ash text-xs mt-0.5">{team.team_members?.[0]?.count ?? 0} members</p>
                {team.captain && <p className="text-ash/60 text-xs mt-1 truncate">Cap: {team.captain.username}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
