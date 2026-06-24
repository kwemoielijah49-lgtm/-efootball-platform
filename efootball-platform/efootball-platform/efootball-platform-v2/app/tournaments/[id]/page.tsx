import Nav from '@/components/layout/Nav'
import { supabase } from '@/lib/supabase'
import { Trophy, Calendar, Users } from 'lucide-react'
import { getRoundName } from '@/lib/bracket'
import { notFound } from 'next/navigation'

async function getTournament(id: string) {
  const [{ data: tournament }, { data: entries }, { data: matches }] = await Promise.all([
    supabase.from('tournaments').select('*, users(username)').eq('id', id).single(),
    supabase.from('tournament_entries').select('*, teams(id, name)').eq('tournament_id', id),
    supabase.from('matches').select('*, team_a:team_a_id(id, name), team_b:team_b_id(id, name), winner:winner_id(id, name)').eq('tournament_id', id).order('round').order('bracket_position'),
  ])
  return { tournament, entries: entries ?? [], matches: matches ?? [] }
}

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tournament, entries, matches } = await getTournament(id)
  if (!tournament) notFound()

  const maxRound = matches.reduce((max: number, m: any) => Math.max(max, m.round), 0)
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1)
  const matchesByRound = rounds.map(r => matches.filter((m: any) => m.round === r))

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0">
        <div className="bg-pitch-mid border-b border-pitch-border px-4 py-6">
          <p className="section-label mb-2">Tournament</p>
          <h1 className="font-display text-3xl md:text-4xl text-chalk font-bold mb-2">{tournament.name}</h1>
          {tournament.description && <p className="text-ash text-sm mb-3">{tournament.description}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <span className={`badge badge-${tournament.status}`}>{tournament.status.replace('_', ' ')}</span>
            <span className="text-ash text-xs flex items-center gap-1">
              <Calendar size={11} />
              {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long' }) : 'Date TBD'}
            </span>
            <span className="text-ash text-xs flex items-center gap-1">
              <Users size={11} /> {entries.length}/{tournament.max_participants}
            </span>
          </div>
          {tournament.prize_info && (
            <p className="text-volt font-semibold text-sm mt-3">🏆 {tournament.prize_info}</p>
          )}
        </div>
        <div className="px-4 py-5 max-w-2xl">
          <div className="mb-6">
            <p className="section-label mb-3">Participants ({entries.length})</p>
            {entries.length === 0 ? (
              <div className="card text-center py-6">
                <p className="text-ash text-sm">No teams registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {entries.map((e: any) => (
                  <div key={e.id} className="card py-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pitch border border-pitch-border flex items-center justify-center flex-shrink-0">
                      <span className="text-volt font-display font-bold text-sm">{e.teams?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-chalk text-sm font-display truncate">{e.teams?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {matches.length > 0 && (
            <div>
              <p className="section-label mb-3">Bracket</p>
              <div className="space-y-5">
                {rounds.map((round, ri) => (
                  <div key={round}>
                    <p className="text-volt text-xs font-display uppercase tracking-widest mb-2">{getRoundName(round, maxRound)}</p>
                    <div className="space-y-2">
                      {matchesByRound[ri].map((match: any) => (
                        <div key={match.id} className={`card border ${match.status === 'disputed' ? 'border-red-800/50' : match.status === 'confirmed' ? 'border-green-800/30' : 'border-pitch-border'}`}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-display text-sm ${match.winner_id === match.team_a?.id && match.status === 'confirmed' ? 'text-volt' : 'text-chalk'}`}>{match.team_a?.name ?? 'TBD'}</span>
                                {match.winner_id === match.team_a?.id && match.status === 'confirmed' && <Trophy size={12} className="text-volt" />}
                              </div>
                              <div className="border-t border-pitch-border/50 my-1.5" />
                              <div className="flex items-center justify-between">
                                <span className={`font-display text-sm ${match.winner_id === match.team_b?.id && match.status === 'confirmed' ? 'text-volt' : 'text-chalk'}`}>{match.team_b?.name ?? 'TBD'}</span>
                                {match.winner_id === match.team_b?.id && match.status === 'confirmed' && <Trophy size={12} className="text-volt" />}
                              </div>
                            </div>
                            <span className={`badge flex-shrink-0 ${match.status === 'disputed' ? 'badge-disputed' : match.status === 'confirmed' ? 'badge-confirmed' : 'badge-upcoming'}`}>{match.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
