'use client'
import { settingsSchema } from '@/schemas/settingsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlignLeft, Axis3DIcon, BellOff, Clock, Layers, Save } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {z} from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface ErrorMessage {
  message: string
}


interface Preferences {
  NotificationType: "NoNotification" | "FixedIntervals";
  SummaryFormat: "Segmented" | "Paragraph";
}

const settingsPage = () => {

  const { register, handleSubmit, reset } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {

    const getUserPreferences = async () => {

      try {

        const response = await axios.get('/api/getUserPreferences')
        
        const userPreferences = (response.data.message as Preferences)
        
        reset({
          NotificationType: userPreferences.NotificationType,
          SummaryFormat: userPreferences.SummaryFormat
        })

      } catch (error) {

        const axiosError = error as AxiosError
        const errorMessage = (axiosError.response?.data as ErrorMessage).message

        toast.error(errorMessage)
      }
    }
    getUserPreferences()

  }, [])

  const handleSettingsSubmit = async (data: z.infer<typeof settingsSchema>) => {

    try {

      console.log(data)

      const response = await axios.put('/api/settings', data)

      if(response.statusText === 'OK'){
        toast.success(response.data.message)
      }
      
    } catch (error) {

      const axiosError = error as AxiosError
      const errorMessage = (axiosError.response?.data as ErrorMessage).message
      
      toast.error(errorMessage)
      
    }
  }

  return (
    <div className='max-h-screen top-0'>

      <hr />

      <div className='max-w-4xl mx-auto px-4 py-8 flex flex-col space-y-6'>

        <h1 className='text-3xl font-black dark:text-white'>
          Settings
        </h1>

        {/* notification preferences */}
        <div className='bg-white shadow-md dark:bg-[#1F2937] rounded-lg px-6 pb-4'>

          <h2 className='text-xl font-bold mt-6'>
            Notification Preferences
          </h2>
          
          <form
            onSubmit={handleSubmit(handleSettingsSubmit)}
            className="flex flex-col"
          >

            {/* upper part */}
            <div className='flex flex-col mt-6 space-y-4'>

              {/* radio button 1 */}
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  value='NoNotification'
                  id="noNotification"
                  className='w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500'
                  {...register('NotificationType')}
                />
                <label htmlFor="noNotification" className='flex justify-center items-center gap-4'>
                  <span className='bg-gray-400 rounded-full self-center p-2'>
                    <BellOff size={20}/>
                  </span>
                  <div>
                    <span className='font-black text-lg'>
                      No Notifications
                    </span>
                    <p className='text-sm dark:text-gray-300 text-gray-600'>
                      I'll log entries manually without reminders
                    </p>
                  </div>
                </label>
              </div>
            
              {/* radio button 2 */}
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="fixedIntervals"
                  value='FixedIntervals'
                  className='w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500'
                  {...register('NotificationType')}
                />
                <label htmlFor="fixedIntervals" className='flex justify-center items-center gap-4'>
                  <span className='bg-purple-800/40 rounded-full self-center p-2'>
                    <Clock className='dark:text-purple-400 text-purple-600' size={20}/>
                  </span>
                  <div>
                    <span className='font-black text-lg'>
                      Fixed Intervals
                    </span>
                    <p className='text-sm dark:text-gray-300 text-gray-600'>
                      Remind me at regular intervals throughout the day
                    </p>
                  </div>
                </label>
              </div>

            </div>
            
            <hr className="my-8 border-t border-gray-600" />

            {/* lower part */}
            <div className='flex flex-col space-y-4'>

              <h2 className='text-xl font-bold'>
                Summary Preferences
              </h2>

              <p className='dark:text-gray-300 text-gray-600'>
                Choose your preferred default summary format:
              </p>

              <div className='grid grid-rows-2 grid-cols-1 gap-5 sm:grid-cols-2 sm:grid-rows-1'>

                {/* radio button 1 */}
                <div
                className={`flex border rounded-xl p-4 gap-4 cursor-pointer transition-colors duration-200`}
                >
                  <input
                    type="radio"
                    id="paragraph"
                    value='Paragraph'
                    className='peer w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500'
                    {...register('SummaryFormat')}
                  />
                  <label htmlFor='paragraph' className='space-y-1'>

                    <div className='flex space-x-2'>
                      <span>
                        <AlignLeft className='text-purple-400' size={22}/>
                      </span>
                      <span className='font-bold'>
                        Paragraph Format
                      </span>
                    </div>

                    <p className='text-sm dark:text-gray-300 text-gray-600'>
                      A concise paragraph summarizing your entire day
                    </p>

                  </label>
                </div>

                {/* radio button 2 */}
                <div
                  className={`flex border rounded-xl p-4 gap-4 cursor-pointer  transition-colors duration-200`}
                >
                  <input
                    type="radio"
                    id="segmented"
                    value='Segmented'
                    className='peer w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500'
                    {...register('SummaryFormat')}
                  />
                  <label htmlFor='segmented' className='space-y-1'>

                    <div className='flex space-x-2'>
                      <span>
                        <Layers className='text-purple-400' size={22}/>
                      </span>
                      <span className='font-bold'>
                        Segmented Format
                      </span>
                    </div>

                    <p className='text-sm dark:text-gray-300 text-gray-600'>
                      Divides your day into Morning, Afternoon, Evening, and Night sections
                    </p>

                  </label>
                </div>

              </div>

            </div>

            <hr className="my-8 border-t border-gray-600" />

            {/* submit button */}
            <div className='flex justify-end items-center space-x-3'>

              <button
                type='submit'
                className='flex cursor-pointer border border-transparent active:border-purple-300 gap-2
                rounded-lg p-2 bg-gradient-to-r from-purple-500 to-blue-400 text-lg justify-center items-center font-bold'
              >
                <Save size={20} />
                Save Changes
              </button>

            </div>
          
          </form>


        </div>
        
      </div>

    </div>
  )
}

export default settingsPage