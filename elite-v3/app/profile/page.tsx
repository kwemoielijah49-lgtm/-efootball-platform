import Nav from '@/components/layout/Nav'
import { User, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-pitch">
      <Nav />
      <main className="md:pl-56 pb-20 md:pb-0 px-4 py-6 max-w-2xl">
        <p className="section-label mb-6">Your Account</p>
        <div className="card text-center py-12 mb-6">
          <div className="w-20 h-20 rounded-full bg-pitch border border-pitch-border flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-ash/30" />
          </div>
          <h2 className="text-xl text-chalk mb-2" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Join the Community</h2>
          <p className="text-ash text-sm mb-6 max-w-xs mx-auto">Create an account to register for tournaments, build your team, and track your match history.</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/auth/register" className="btn-primary justify-center"><Zap size={14} /> Create Account</Link>
            <Link href="/auth/login" className="btn-ghost justify-center">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
