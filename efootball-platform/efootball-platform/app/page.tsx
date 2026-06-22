import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import HighlightsBar from '@/components/highlights/HighlightsBar'
import { supabase } from '@/lib/supabase'
import { Trophy, Users, ArrowRight, Zap } from 'lucide-react'

async function getData() {
  const [{ data: tournaments }, { data: teams }] = await Promise.all([
    supabase.from('tournaments').select('*').eq('status', 'upcoming').order('start_date', { ascending: true }).limit(3),
    supabase.from('teams').select('*, team_members(count)').order('created_at', { ascending: false }).limit(4),
  ])
  return { tournaments: tournaments ?? [], teams: teams ?? [] }
}

export default async function Home() {
  const { tournaments, teams } = await getData()

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0">
        {/* Hero */}
        <div className="relative overflow-hidden bg-pitch-mid border-b border-pitch-border px-5 pt-10 pb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-volt/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <p className="section-label mb-3">East Africa's #1 eFootball Hub</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-chalk leading-none mb-4">
            COMPETE.<br />
            <span className="text-volt">DOMINATE.</span><br />
            REPEAT.
          </h1>
          <p className="text-ash text-sm max-w-xs mb-6">
            Join the most competitive eFootball mobile community in East Africa. Tournament brackets, team rankings, real results.
          </p>
          <div className="flex gap-3">
            <Link href="/tournaments" className="btn-primary">
              <Trophy size={14} /> Find a Tournament
            </Link>
            <Link href="/teams" className="btn-ghost">
              <Users size={14} /> Browse Teams
            </Link>
          </div>
        </div>

        <div className="px-4 py-5 max-w-2xl">
          {/* Highlights */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label flex items-center gap-2"><Zap size={12} className="text-volt" /> Community Highlights</p>
            </div>
            <HighlightsBar />
          </div>

          {/* Upcoming tournaments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label"><Trophy size={12} className="inline mr-1.5 text-volt" />Upcoming Tournaments</p>
              <Link href="/tournaments" className="text-volt text-xs font-display uppercase tracking-wider flex items-center gap-1">
                All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {tournaments.length === 0 && (
                <div className="card text-center py-8">
                  <p className="text-ash text-sm">No tournaments yet. Check back soon.</p>
                </div>
              )}
              {tournaments.map((t: any) => (
                <Link key={t.id} href={`/tournaments/${t.id}`} className="card hover:border-volt/40 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg text-chalk group-hover:text-volt transition-colors">{t.name}</h3>
                      <p className="text-ash text-xs mt-1">
                        {t.start_date ? new Date(t.start_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}
                        {' · '}{t.max_participants} players max
                      </p>
                    </div>
                    <span className={`badge badge-${t.status} flex-shrink-0`}>{t.status.replace('_', ' ')}</span>
                  </div>
                  {t.prize_info && (
                    <p className="text-volt text-xs mt-2 font-semibold">🏆 {t.prize_info}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Teams */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label"><Users size={12} className="inline mr-1.5 text-volt" />Recent Teams</p>
              <Link href="/teams" className="text-volt text-xs font-display uppercase tracking-wider flex items-center gap-1">
                All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {teams.map((team: any) => (
                <Link key={team.id} href={`/teams/${team.id}`} className="card hover:border-volt/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-pitch border border-pitch-border flex items-center justify-center mb-2">
                    <span className="text-volt font-display font-bold">{team.name[0].toUpperCase()}</span>
                  </div>
                  <h4 className="font-display text-chalk text-base group-hover:text-volt transition-colors truncate">{team.name}</h4>
                  <p className="text-ash text-xs mt-0.5">{team.team_members?.[0]?.count ?? 0} members</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
