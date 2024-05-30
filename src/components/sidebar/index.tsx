import Image from 'next/image'
import Link from 'next/link'

export default function SideBar () {
  return (
    <aside className='w-40 bg-white'>
      <div className='flex justify-center border-r'>
        <Image src='/assets/logo.png' width={80} height={80} alt='logo'></Image>
      </div>
      <hr />

      <nav>
        <ol>
          <li className='text-center border-b cursor-pointer hover:bg-slate-400 hover:text-white'>
            <Link className='block py-4' href='/user'>
              User
            </Link>
          </li>
          <li className='text-center border-b cursor-pointer hover:bg-slate-400 hover:text-white'>
            <Link className='block py-4' href='/blog'>
              Blog
            </Link>
          </li>
        </ol>
      </nav>
    </aside>
  )
}
