import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import { supabase } from '@/lib/supabase'
import { Trophy, Calendar, Users } from 'lucide-react'

async function getTournaments() {
  const { data } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments()
  const upcoming = tournaments.filter((t: any) => t.status === 'upcoming')
  const active = tournaments.filter((t: any) => t.status === 'in_progress')
  const completed = tournaments.filter((t: any) => t.status === 'completed')

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0 px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-1">All Events</p>
            <h1 className="text-3xl font-display font-bold text-chalk">TOURNAMENTS</h1>
          </div>
        </div>

        {active.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-volt animate-pulse" /> Live Now
            </p>
            <div className="flex flex-col gap-3">
              {active.map((t: any) => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="mb-6">
            <p className="section-label mb-3">Upcoming</p>
            <div className="flex flex-col gap-3">
              {upcoming.map((t: any) => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        )}

        {upcoming.length === 0 && active.length === 0 && (
          <div className="card text-center py-12 mb-6">
            <Trophy size={32} className="text-ash/30 mx-auto mb-3" />
            <p className="text-ash text-sm">No active tournaments right now.</p>
            <p className="text-ash/50 text-xs mt-1">Check back soon or ask an admin to create one.</p>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <p className="section-label mb-3">Completed</p>
            <div className="flex flex-col gap-3">
              {completed.map((t: any) => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function TournamentCard({ t }: { t: any }) {
  return (
    <Link href={`/tournaments/${t.id}`} className="card hover:border-volt/40 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl text-chalk group-hover:text-volt transition-colors truncate">{t.name}</h3>
          {t.description && <p className="text-ash text-xs mt-1 line-clamp-2">{t.description}</p>}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-ash text-xs flex items-center gap-1">
              <Calendar size={11} />
              {t.start_date ? new Date(t.start_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : 'TBD'}
            </span>
            <span className="text-ash text-xs flex items-center gap-1">
              <Users size={11} /> Max {t.max_participants}
            </span>
            <span className="text-ash text-xs uppercase">{t.format.replace('_', ' ')}</span>
          </div>
        </div>
        <span className={`badge badge-${t.status} flex-shrink-0`}>{t.status.replace('_', ' ')}</span>
      </div>
      {t.prize_info && <p className="text-volt text-xs mt-3 font-semibold">🏆 {t.prize_info}</p>}
    </Link>
  )
}
