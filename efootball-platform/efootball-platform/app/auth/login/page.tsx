'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) setError(error.message)
    else window.location.href = '/profile'
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-volt font-display font-bold text-4xl tracking-widest uppercase">eLiTe</span>
          <p className="text-ash text-sm mt-2">Sign in to your account</p>
        </div>
        <div className="card flex flex-col gap-4">
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="btn-primary justify-center">
            <Zap size={14} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        <p className="text-center text-ash text-sm mt-4">
          No account? <Link href="/auth/register" className="text-volt hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
