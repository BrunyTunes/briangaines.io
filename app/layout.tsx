import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brian Gaines — Cybersecurity Portfolio',
  description: 'Threat detection is my job. Breaking my own network is my hobby. The overlap is useful.',
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
      suppressHydrationWarning
      className={outfit.variable}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}