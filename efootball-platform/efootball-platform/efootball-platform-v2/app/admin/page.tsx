'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/layout/Nav'
import { supabase } from '@/lib/supabase'
import { Shield, Plus, AlertTriangle, Trophy, Check, X } from 'lucide-react'

export default function AdminPage() {
  const [tab, setTab] = useState<'tournaments' | 'disputes'>('tournaments')
  const [disputes, setDisputes] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '', start_date: '', max_participants: 16, prize_info: '' })
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('disputes').select('*, matches(id, round, team_a:team_a_id(name), team_b:team_b_id(name)), users(username)')
      .eq('status', 'open').then(({ data }) => setDisputes(data ?? []))
  }, [])

  async function createTournament() {
    if (!form.name) return
    setCreating(true)
    const { error } = await supabase.from('tournaments').insert({
      name: form.name,
      description: form.description || null,
      start_date: form.start_date || null,
      max_participants: form.max_participants,
      prize_info: form.prize_info || null,
      format: 'single_elimination',
    })
    setCreating(false)
    setMsg(error ? `Error: ${error.message}` : 'Tournament created!')
    if (!error) setForm({ name: '', description: '', start_date: '', max_participants: 16, prize_info: '' })
  }

  async function resolveDispute(id: string, notes: string) {
    await supabase.from('disputes').update({ status: 'resolved', admin_notes: notes }).eq('id', id)
    setDisputes(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0 px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-volt" />
          <h1 className="font-display text-3xl text-chalk font-bold">ADMIN PANEL</h1>
        </div>

        <div className="flex gap-1 mb-6 bg-pitch-card border border-pitch-border rounded-lg p-1">
          {(['tournaments', 'disputes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-display uppercase tracking-wide transition-colors ${tab === t ? 'bg-volt text-pitch' : 'text-ash hover:text-chalk'}`}>
              {t}
              {t === 'disputes' && disputes.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{disputes.length}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'tournaments' && (
          <div className="card">
            <h2 className="font-display text-lg text-chalk mb-4 flex items-center gap-2"><Plus size={16} /> Create Tournament</h2>
            <div className="flex flex-col gap-3">
              <input className="input" placeholder="Tournament name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <textarea className="input resize-none h-20" placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input className="input" type="datetime-local" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              <input className="input" type="number" placeholder="Max participants (default 16)" value={form.max_participants} min={2} max={64}
                onChange={e => setForm({ ...form, max_participants: parseInt(e.target.value) })} />
              <input className="input" placeholder="Prize info (optional — e.g. KES 5,000 + trophy)" value={form.prize_info} onChange={e => setForm({ ...form, prize_info: e.target.value })} />
              <button onClick={createTournament} disabled={creating} className="btn-primary justify-center">
                <Trophy size={14} /> {creating ? 'Creating...' : 'Create Tournament'}
              </button>
              {msg && <p className={`text-sm text-center ${msg.startsWith('Error') ? 'text-red-400' : 'text-volt'}`}>{msg}</p>}
            </div>
          </div>
        )}

        {tab === 'disputes' && (
          <div>
            {disputes.length === 0 ? (
              <div className="card text-center py-10">
                <Check size={28} className="text-green-400 mx-auto mb-2" />
                <p className="text-ash text-sm">No open disputes. All clear!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {disputes.map((d: any) => (
                  <DisputeCard key={d.id} dispute={d} onResolve={resolveDispute} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function DisputeCard({ dispute, onResolve }: { dispute: any; onResolve: (id: string, notes: string) => void }) {
  const [notes, setNotes] = useState('')

  return (
    <div className="card border-red-800/40">
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-chalk font-display text-sm">
            Round {dispute.matches?.round}: {dispute.matches?.team_a?.name ?? 'TBD'} vs {dispute.matches?.team_b?.name ?? 'TBD'}
          </p>
          <p className="text-ash text-xs mt-0.5">Raised by: {dispute.users?.username}</p>
          {dispute.reason && <p className="text-ash/80 text-xs mt-1 italic">"{dispute.reason}"</p>}
        </div>
      </div>
      <textarea className="input resize-none h-16 text-xs mb-2" placeholder="Admin resolution notes..." value={notes} onChange={e => setNotes(e.target.value)} />
      <button onClick={() => onResolve(dispute.id, notes)} className="btn-primary text-xs w-full justify-center">
        <Check size={12} /> Mark Resolved
      </button>
    </div>
  )
}
