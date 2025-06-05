'use client'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../ThemeToggle'
import Logo from './Logo'
import Link from 'next/link';
import { Home, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';

const AuthNavbar = () => {

  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/'
    })
  }

  return (
    <div className='min-h-18 py-4 flex items-center max-w-6xl justify-between mx-auto px-3 z-50'>
        <Logo />

        <div className='flex'>
            <div className='flex justify-center sm:space-x-5'>

                <div className='flex gap-4'>

                  <Link
                  href={'/log'}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${ pathname === '/log' ? 
                    'text-purple-600 bg-purple-500/20 dark:text-purple-400 dark:bg-purple-900/20' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20'
                  }`}>
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Log</span>
                  </Link>

                  <Link
                  href={'/settings'}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${ pathname === '/settings' ? 
                    'text-purple-600 bg-purple-500/20 dark:text-purple-400 dark:bg-purple-900/20' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20'
                  }`}>
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </Link>

                </div>

                <ThemeToggle />

                <button
                  className='px-3 py-2 rounded-md dark:text-gray-300 bg-red-600 text-white cursor-pointer'
                  onClick={handleLogout}>
                  Logout
                </button>

            </div>
        </div>
    </div>
  )
}

export default AuthNavbar