import Nav from '@/components/layout/Nav'
import { supabase } from '@/lib/supabase'
import { Users, Trophy, UserPlus } from 'lucide-react'
import { notFound } from 'next/navigation'

async function getTeam(id: string) {
  const [{ data: team }, { data: members }, { data: entries }] = await Promise.all([
    supabase.from('teams').select('*, captain:captain_id(username)').eq('id', id).single(),
    supabase.from('team_members').select('*, users(username, avatar_url)').eq('team_id', id),
    supabase.from('tournament_entries').select('*, tournaments(id, name, status)').eq('team_id', id).order('registered_at', { ascending: false }),
  ])
  return { team, members: members ?? [], entries: entries ?? [] }
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const { team, members, entries } = await getTeam(params.id)
  if (!team) notFound()

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0">
        <div className="bg-pitch-mid border-b border-pitch-border px-4 py-6">
          <div className="w-16 h-16 rounded-full bg-pitch border border-pitch-border flex items-center justify-center mb-4">
            <span className="text-volt font-display font-bold text-3xl">{team.name[0].toUpperCase()}</span>
          </div>
          <h1 className="font-display text-3xl text-chalk font-bold">{team.name}</h1>
          <p className="text-ash text-sm mt-1">Captain: {team.captain?.username ?? 'Unknown'}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-ash text-xs flex items-center gap-1"><Users size={11} /> {members.length} members</span>
            <span className="text-ash text-xs flex items-center gap-1"><Trophy size={11} /> {entries.length} tournaments</span>
          </div>
          <button className="btn-ghost mt-4 text-xs"><UserPlus size={13} /> Request to Join</button>
        </div>

        <div className="px-4 py-5 max-w-2xl">
          <div className="mb-6">
            <p className="section-label mb-3">Roster</p>
            <div className="flex flex-col gap-2">
              {members.map((m: any) => (
                <div key={m.id} className="card py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pitch border border-pitch-border flex items-center justify-center flex-shrink-0">
                    <span className="text-volt font-display font-bold">{m.users?.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-chalk font-display text-sm">{m.users?.username}</p>
                    <p className="text-ash text-xs capitalize">{m.role}</p>
                  </div>
                  {m.role === 'captain' && <Trophy size={14} className="text-volt flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {entries.length > 0 && (
            <div>
              <p className="section-label mb-3">Tournament History</p>
              <div className="flex flex-col gap-2">
                {entries.map((e: any) => (
                  <div key={e.id} className="card py-3 flex items-center justify-between">
                    <p className="text-chalk font-display text-sm">{e.tournaments?.name}</p>
                    <span className={`badge badge-${e.tournaments?.status}`}>{e.tournaments?.status?.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
