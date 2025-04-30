import { useRouter } from 'next/navigation'
import ThemeToggle from '../ThemeToggle';
import Logo from './Logo'

const UnAuthNavbar = () => {

  const router = useRouter();

  return (
    <div className='min-h-18 py-4 flex items-center max-w-6xl justify-between mx-auto px-3'>
        <Logo />

        <div className='flex'>
            <div className='flex justify-center space-x-5'>
                
                <button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                text-white text-lg rounded-full p-2 px-6 transition-all cursor-pointer'
                  onClick={() => router.push('/sign-up')}>
                    Get Started
                </button>

                <ThemeToggle />
            </div>
        </div>
    </div>
  )
}

export default UnAuthNavbar