import React from 'react'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'blog background mangement',
  description: 'blog background mangement'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  )
}
