import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], display: 'swap' })

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Welcome to my personal portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.className} bg-white dark:bg-dark text-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  )
} 