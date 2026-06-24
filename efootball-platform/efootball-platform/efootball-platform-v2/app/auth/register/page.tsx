'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Zap } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', username: '', konami_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (authError) { setError(authError.message); setLoading(false); return }

    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        username: form.username,
        email: form.email,
        platform_ids: form.konami_id ? { konami_id: form.konami_id } : {},
      })
      if (profileError) { setError(profileError.message); setLoading(false); return }
    }
    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen bg-pitch flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-volt font-display font-bold text-4xl tracking-widest">eLiTe</span>
        <div className="card mt-6 text-center py-8">
          <p className="text-chalk font-display text-xl mb-2">Account Created!</p>
          <p className="text-ash text-sm mb-4">Check your email to confirm your account.</p>
          <Link href="/auth/login" className="btn-primary mx-auto inline-flex">Sign In</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-volt font-display font-bold text-4xl tracking-widest uppercase">eLiTe</span>
          <p className="text-ash text-sm mt-2">Join the community</p>
        </div>
        <div className="card flex flex-col gap-4">
          <input className="input" placeholder="Username *" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input className="input" type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <div>
            <input className="input" placeholder="Konami ID (optional)" value={form.konami_id} onChange={e => setForm({ ...form, konami_id: e.target.value })} />
            <p className="text-ash/50 text-xs mt-1 px-1">Used for match verification</p>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleRegister} disabled={loading} className="btn-primary justify-center">
            <Zap size={14} /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
        <p className="text-center text-ash text-sm mt-4">
          Already have an account? <Link href="/auth/login" className="text-volt hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
