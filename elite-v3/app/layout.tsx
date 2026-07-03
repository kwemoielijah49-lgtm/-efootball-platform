import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'eLiTe — eFootball Community Platform',
  description: "East Africa's home for competitive eFootball.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
