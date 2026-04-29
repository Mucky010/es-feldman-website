import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Esther Feldman',
  description: 'Organizational psychologist, policy architect, and health-tech founder.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="page-enter">
          {children}
        </main>
      </body>
    </html>
  )
}
