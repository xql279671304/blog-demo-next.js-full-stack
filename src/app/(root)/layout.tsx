import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import '../styles/globals.css'
import '../styles/quillCustom.css'
import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'
import { getAuthSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'blog demo',
  description: 'blog demo'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  return (
    <html lang='en'>
      <body className='flex h-screen bg-gray-100'>
        <Sidebar></Sidebar>

        <div className='flex-1 flex flex-col overflow-hidden'>
          <Topbar session={session}></Topbar>

          <main className='flex-1 overflow-x-hidden overflow-y-auto bg-white m-10 p-5 rounded-sm'>
            {children}
          </main>
        </div>

        <Toaster />
      </body>
    </html>
  )
}
