'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Users, Zap, User, Shield } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/', icon: Zap, label: 'Home' },
  { href: '/tournaments', icon: Trophy, label: 'Tournaments' },
  { href: '/teams', icon: Users, label: 'Teams' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/admin', icon: Shield, label: 'Admin' },
]

export default function Nav() {
  const path = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col bg-pitch-mid border-r border-pitch-border z-50 py-6 px-4">
        <Link href="/" className="flex items-center gap-2 mb-10 px-2">
          <span className="text-volt text-2xl font-display font-bold tracking-widest uppercase">eLiTe</span>
        </Link>
        <div className="flex flex-col gap-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                path === href
                  ? 'bg-volt/10 text-volt border border-volt/20'
                  : 'text-ash hover:text-chalk hover:bg-pitch-card'
              )}
            >
              <Icon size={16} />
              <span className="font-display uppercase tracking-wide">{label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto px-2">
          <p className="text-ash/40 text-xs leading-relaxed">
            Not affiliated with or endorsed by Konami Digital Entertainment.
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-pitch-mid border-t border-pitch-border z-50 flex">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
              path === href ? 'text-volt' : 'text-ash'
            )}
          >
            <Icon size={18} />
            <span className="font-display uppercase tracking-wide text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
