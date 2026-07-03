'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, X } from 'lucide-react'

type Highlight = {
  id: string
  user_id: string
  media_url: string
  caption: string | null
  is_sponsored: boolean
  sponsor_label: string | null
  users?: { username: string; avatar_url: string | null }
}

export default function HighlightsBar() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [active, setActive] = useState<Highlight | null>(null)

  useEffect(() => {
    supabase.from('highlights').select('*, users(username, avatar_url)')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(12)
      .then(({ data }) => { if (data) setHighlights(data as Highlight[]) })
  }, [])

  return (
    <>
      <div className="flex gap-3 overflow-x-auto py-3 px-1">
        <button className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-full bg-pitch-card border-2 border-dashed border-pitch-border flex items-center justify-center hover:border-volt transition-colors">
            <Plus size={18} className="text-ash" />
          </div>
          <span className="text-[10px] text-ash uppercase tracking-wide">Add</span>
        </button>
        {highlights.map((h, i) => (
          <div key={h.id} className="flex gap-3">
            {i > 0 && i % 6 === 0 && (
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-700/50 flex items-center justify-center">
                  <span className="text-yellow-500 text-xs font-bold">AD</span>
                </div>
                <span className="text-[10px] text-yellow-600 uppercase tracking-wide">Sponsored</span>
              </div>
            )}
            <button onClick={() => setActive(h)} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${h.is_sponsored ? 'border-yellow-500' : 'border-volt highlight-ring'}`}>
                {h.media_url ? <img src={h.media_url} alt="" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full bg-pitch-card flex items-center justify-center">
                    <span className="text-volt font-bold text-lg">{h.users?.username?.[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-ash uppercase tracking-wide max-w-[56px] truncate">{h.is_sponsored ? h.sponsor_label : h.users?.username}</span>
            </button>
          </div>
        ))}
      </div>
      {active && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-4 text-chalk" onClick={() => setActive(null)}><X size={24} /></button>
          <div className="max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            {active.is_sponsored && <div className="text-center mb-2"><span className="badge badge-upcoming text-yellow-400 border-yellow-700/50">Sponsored — {active.sponsor_label}</span></div>}
            <img src={active.media_url} alt="" className="w-full rounded-xl" />
            {active.caption && <p className="text-chalk text-sm mt-3 text-center">{active.caption}</p>}
          </div>
        </div>
      )}
    </>
  )
}
