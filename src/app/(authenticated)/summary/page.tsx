'use client'
import { Calendar, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const summaryPage = () => {

    const router = useRouter();

  return (
    <div className='max-h-screen'>

        <hr />

        <div className='p-12'>

            <div className='flex flex-col justify-center items-center px-10 py-6 min-h-[400px] bg-white shadow-lg dark:bg-gray-800 max-w-3xl mx-auto space-y-6 rounded-xl'>

                <div className='flex'>
                    <span>
                        <Calendar size={20} />
                    </span>
                    <span>
                        Tuesday, April 29, 2025
                    </span>
                </div>

                <h1 className='text-red-600 text-4xl font-black'>
                    Productive Day!
                </h1>

                <p className='text-xl text-center dark:text-gray-300 text-gray-700 leading-relaxed'>
                    You had a highly focused day with consistent work patterns. Started strong with team meetings and coding tasks in the morning. Took regular short breaks which helped maintain productivity. Completed most planned tasks and showed good time management skills throughout the day.
                </p>

                <button
                    className='group flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600
                    hover:from-purple-700 hover:to-blue-700 text-white text-lg rounded-full p-2 px-6 transition-all gap-2'
                    onClick={() => router.push('/log')}
                >
                    <span className='group-hover:translate-x-2 transition-all duration-300'>
                        <ChevronLeft />
                    </span>
                    Back to dashboard
                </button>

            </div>

        </div>

    </div>
  )
}

export default summaryPage