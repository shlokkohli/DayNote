'use client'
import { getFormattedDate } from '@/helper/getFormattedDate'
import axios, { AxiosError } from 'axios'
import { Calendar, ChevronLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GenericLoader from '@/components/Skeletons/GenricLoader'
import { getCustomDate } from '@/helper/getCustomDate'

interface output {
    summary: string
}

interface ErrorMessage {
    message: string
}

const summaryPage = () => {

    const router = useRouter();

    const [date, SetDate] = useState('')
    const [summary, setSummary] = useState('')
    const [heading, setHeading] = useState('')
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams();
    const generate = searchParams.get('generate')
    const id = searchParams.get('id')

    console.log("THis is id", id)

    let shouldGenerate = false;

    if(generate === 'true'){
        shouldGenerate = true;
    }

    useEffect(() => {

        const getUserSummar = async () => {

            try {

                setLoading(true)

                if(shouldGenerate){
                    const response = await axios.post('/api/generateSummary')
                    const message = (response.data as output).summary

                    const summaryParts = message.split('\n')

                    setHeading(summaryParts[0].replace(/\*\*(.*?)\*\*/g, '$1'))

                    const formattedParts = summaryParts.slice(2) // skip heading and empty line
                    .filter(part => part.trim() !== '') // remove extra empty lines
                    .map((part) => 
                    part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **text** with <strong>text</strong>
                    );
            
                    const finalSummary = formattedParts.join('<br/><br/>');// Add spacing between parts
            
                    setSummary(finalSummary);

                } else {

                    const response = await axios.get(`/api/userSummaries/${id}`);
                   
                    const latestSummary = response.data.summaries.content
                    
                    SetDate(getCustomDate(response.data.summaries.createdAt));

                    const summaryParts = latestSummary.split('\n')

                    setHeading(summaryParts[0])

                    const formattedParts = summaryParts.slice(2) // skip heading and empty line
                    .filter((part : any) => part.trim() !== '') // remove extra empty lines
                    .map((part : any) => 
                    part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **text** with <strong>text</strong>
                    );
            
                    const finalSummary = formattedParts.join('<br/><br/>');// Add spacing between parts
            
                    setSummary(finalSummary);

                }
                
            } catch (error) {

                const axiosError = error as AxiosError
                const errorMessage = (axiosError.response?.data as ErrorMessage).message

                setHeading(errorMessage)
                setSummary('')
                
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

                    <p className='text-xl text-center dark:text-white text-gray-700 overflow-scroll'
                        dangerouslySetInnerHTML={{ __html: summary }}>
                    </p>

                    {id ? (
                        <>
                            <button
                            className='group flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600
                            hover:from-purple-700 hover:to-blue-700 text-white text-lg rounded-full p-2 px-6 transition-all gap-2'
                            onClick={() => router.push('/calendar')}>
                                <span className='group-hover:translate-x-2 transition-all duration-300'>
                                    <ChevronLeft />
                                </span>
                                Back to Calendar
                            </button> 
                        </>
                    ) : (
                        <>
                            <button
                            className='group flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600
                            hover:from-purple-700 hover:to-blue-700 text-white text-lg rounded-full p-2 px-6 transition-all gap-2'
                            onClick={() => router.push('/log')}>
                                <span className='group-hover:translate-x-2 transition-all duration-300'>
                                    <ChevronLeft />
                                </span>
                                Back to dashboard
                            </button>
                        </>
                    )}

                </>
                    
                )}


            </div>

        </div>

    </div>
  )
}

export default summaryPage