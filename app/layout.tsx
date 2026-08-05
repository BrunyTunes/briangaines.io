import type { Metadata } from 'next'
import { Archivo, Work_Sans, IBM_Plex_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

// Display face — bold sans, black weight, used only for headlines and titles
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
})

// Body face — quiet, readable, carries the paragraph text
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

// Utility face — used sparingly for eyebrows, tags, and metadata only
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brian Gaines — Cybersecurity Portfolio',
  description: 'Threat detection is my job. Breaking my own network is my hobby. The overlap is useful.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Brian Gaines — Cybersecurity Portfolio',
    description: 'Threat detection is my job. Breaking my own network is my hobby.',
    url: 'https://briangaines.io',
    siteName: 'Brian Gaines',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brian Gaines — Cybersecurity Portfolio',
    description: 'Threat detection is my job. Breaking my own network is my hobby.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
