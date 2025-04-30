'use client'
import { getFormattedDate } from '@/helper/getFormattedDate'
import axios, { AxiosError } from 'axios'
import { Calendar, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GenericLoader from '@/components/Skeletons/GenricLoader'

interface output {
    summary: string
}

interface ErrorMessage {
    message: string
}

const summaryPage = () => {

    const router = useRouter();
    const date = getFormattedDate()

    const [summary, setSummary] = useState('')
    const [heading, setHeading] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const getUserSummar = async () => {

            try {

                setLoading(true)

                const response = await axios.post('/api/generateSummary')
                const message = (response.data as output).summary

                const summaryParts = message.split('\n')

                setHeading(summaryParts[0])

                const formattedSummary = summaryParts[2].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

                setSummary(formattedSummary)
                
            } catch (error) {

                const axiosError = error as AxiosError
                const errorMessage = (axiosError.response?.data as ErrorMessage).message

                console.log(errorMessage)
                
            } finally {
                setLoading(false)
            }

        }

        getUserSummar()

    }, [])

  return (
    <div className='max-h-screen'>

        <hr />

        <div className='p-12'>

            <div className='flex flex-col justify-center items-center px-10 py-6 max-h-[400px] bg-white shadow-lg dark:bg-gray-800 max-w-3xl mx-auto space-y-6 rounded-xl'>

                {loading ? (
                    <div className='text-white'>
                        <GenericLoader />
                    </div>
                ) : (
                <>

                    <div className='flex items-center'>
                        <Calendar size={20} />
                        <span>&nbsp;{date}</span>
                    </div>

                    <h1 className='text-red-600 text-4xl font-black'>
                        {heading}
                    </h1>

                    <p className='text-xl text-center dark:text-white text-gray-700 leading-relaxed'
                        dangerouslySetInnerHTML={{ __html: summary }}>
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

                </>
                    
                )}


            </div>

        </div>

    </div>
  )
}

export default summaryPage