'use client'
import UnAuthNavbar from '@/components/Navbar/UnAuthNavbar';
import { ChevronRight, AlarmClock, Brain, ChartLine } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className='min-h-screen'>
      <div className="shadow-sm sticky top-0 backdrop-blur-lg">
        <UnAuthNavbar />
      </div>
      <div className="border-t border-gray-200"></div>

      <main className="w-full mt-8 pt-7">

        <div className="max-w-3xl mx-auto text-center max-h-screen">

          {/* top area */}
          <div>
            <h1 className="md:text-6xl text-5xl font-bold">
              Transform Your Day with <br />
              <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">
                AI-Powered Reflection
              </span>
            </h1>

            <p className="text-gray-700 font-medium text-lg sm:text-xl mt-10 dark:text-white">
              Track your daily activities, get intelligent insights, and build better habits through mindful reflection.
            </p>
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full sm:p-4 sm:px-8 text-white text-lg font-bold
            mt-12 hover:from-purple-700 hover:to-blue-700 cursor-pointer hover:bg-gradient-to-r flex mx-auto items-center gap-2 group py-4 px-18 dark:shadow-sm shadow-purple-500"
            onClick={() => router.push('/sign-up')}
          >
            Start Your Journey{" "}
            <span className="group-hover:translate-x-2 duration-200">
              <ChevronRight />
            </span>
          </button>

          {/* bottom area */}
          <div className="grid sm:grid-rows-1 sm:grid-flow-col gap-8 mt-15 mx-4 sm:mx-4 md:mx-0">

            <div
              className="bg-white dark:bg-slate-700 p-6 flex flex-col items-center rounded-2xl space-y-3 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className="bg-purple-500 h-13 w-13 rounded-xl flex justify-center items-center text-white">
                <AlarmClock />
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                Smart Reminders
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Reminders that fit your schedule
              </p>
            </div>

            <div
              className="bg-white dark:bg-slate-700 p-6 flex flex-col items-center rounded-2xl space-y-3 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-300"
            >
              <div className="bg-blue-500 h-13 w-13 rounded-xl flex justify-center items-center text-white">
                <Brain />
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                AI Insights
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Get personalized analysis of your daily patterns
              </p>
            </div>

            <div
              className="bg-white dark:bg-slate-700 p-6 flex flex-col items-center rounded-2xl space-y-3 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-300"
            >              <div className="bg-purple-500 h-13 w-13 rounded-xl flex justify-center items-center text-white">
                <ChartLine />
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                Progress Tracking
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Visualize your productivity streaks and patterns
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}