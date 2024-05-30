'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

interface Props {
  session: Session | null
}

export default function Topbar ({ session }: Props) {
  const router = useRouter()
  if (!session?.user) {
    router.push('/')
  }

  return (
    <header className='h-20 flex items-center justify-end px-6 bg-white'>
      <h1 className='px-5'>{session?.user?.name ?? ''}</h1>

      {session?.user?.image && (
        <Image
          src={session.user.image}
          alt='account logo'
          width={40}
          height={40}
          className='rounded-full'
        ></Image>
      )}

      <p className='ml-4'>
        <Link
          href='/'
          className='text-sky-500 hover:underline'
          onClick={() => {
            signOut({ callbackUrl: '/' })
          }}
        >
          Log out
        </Link>
      </p>
    </header>
  )
}
