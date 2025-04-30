'use client'
import { Calendar, ChevronLeft, ChevronRight, Clock, PenLine, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { logSchema } from '@/schemas/logSchema';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ErrorMessage {
    message: string
}

const page = () => {

    const [greetings, setGreetings] = useState('')

    const {data: session} = useSession();

    const currentDate = new Date();
    const router = useRouter();

    const hours = currentDate.getHours();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const formattedDate = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`

    const greeting = () => {
        if(hours >= 4 && hours < 12){
            setGreetings('Good Morning')
        }
        else if(hours >= 12 && hours < 17){
            setGreetings('Good Afternoon')
        }
        else if(hours >= 17 && hours < 20){
            setGreetings("Good Evening")
        }
        else if(hours >= 20 && hours <= 23){
            setGreetings("Good Night")
        }
        else if(hours >= 0 && hours < 4){
            setGreetings("Happy Late Night")
        }
    }

    useEffect(() => {
        greeting();
    }, [])

    const { register, handleSubmit, reset, formState: {errors} } = useForm<z.infer<typeof logSchema>>({
        resolver: zodResolver(logSchema),
        defaultValues: {
            logEntry: ''
        }
    });

    const handleLogSubmit = async (data: z.infer<typeof logSchema>) => {

        try {

            const response = await axios.post('/api/log', data)

            if(response.statusText === "OK"){
                toast.success('Great! Your reflection has been saved.')
            }

            reset()
            
        } catch (error) {

            const axiosError = error as AxiosError
            const errorMessage = (axiosError.response?.data as ErrorMessage).message

            toast.error(errorMessage)
            
        }

    }


  return (

    <div className='max-h-screen'>

        {/* log section */}
        <div className='max-w-5xl mx-auto px-4 py-8'>

            <div className="text-center mb-12">

          <div className="flex flex-col">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-2 animate-gradient">
                {greetings},
            </h1>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient">
                {session?.user.name.split(' ')[0]}
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">
            What's on your mind today?
          </p>
            </div>

            <div className='max-w-3xl mx-auto'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8'>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                                        {formattedDate}
                                    </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(handleLogSubmit)} className='space-y-4'>
                        <div className='relative'>
                            <textarea
                                placeholder='What are you doing right now?'
                                rows={3}
                                className='w-full px-6 py-4 rounded-xl border-2 border-purple-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-200 resize-none'
                                style={{ minHeight: '120px' }}
                                {...register('logEntry')}
                            />
                            {errors.logEntry && (
                                <p className='mt-1 text-sm text-red-600'>{errors.logEntry.message}</p>
                            )}

                            <div className='absolute right-4 top-4'>
                                <Clock className='w-4 h-4 text-gray-400' />
                            </div>
                        </div>

                        <div className='flex space-x-6'>
                            
                            <button
                                type='submit'
                                className='w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group'
                            >
                                <PenLine className='w-5 h-5' />
                                <span>Log This Moment</span>
                            </button>

                            <button
                                type='submit'
                                className='w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group'
                                onClick={() => router.push('/summary')}
                            >
                                <Sparkles className='w-5 h-5' />
                                <span>
                                    Generate Summary
                                </span>
                            </button>

                        </div>

                    </form>

                </div>
            </div>

        </div>

    </div>
  )
}

export default page