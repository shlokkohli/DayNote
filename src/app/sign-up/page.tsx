'use client'
import { Book, Clock, AlarmClock, Calendar, Goal } from 'lucide-react';
import SignupForm from '@/components/SignupForm/SignupForm';
import FeatureCard from '@/components/Card/FeatureCard';
import { useState } from 'react';
import Logo from '@/components/Navbar/Logo';
import { signIn } from 'next-auth/react';

const SignupPage: React.FC = () => {
  
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSuccessfulSignUp = () => {
    setIsSignUp(false); // Switch to sign-in form
  };

  const handleGoogleSignSignin = async () => {

    try {

      const response = await signIn('google', {
        callbackUrl: '/log'
      });

      console.log('This is the response', response)
      
    } catch (error) {

      console.log("Some error occured")
      
    }

  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left side - Sign up form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12">
      
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-500 mt-2 dark:text-white">
              {isSignUp 
                ? 'Start journaling and reflecting on your days' 
                : 'Sign in to continue your journaling journey'}
            </p>
          </div>
          
          <SignupForm isSignUp={isSignUp} onSuccessfulSignup={handleSuccessfulSignUp} />
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-white">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 font-medium ml-2 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
          
          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-700 dark:text-white text-gray-500">OR</span>
              </div>
            </div>
            
            <div className="mt-6">
            <button
              className="w-full flex items-center dark:bg-white justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-3xl
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-blue-500 
              focus:ring-blue-500"
              onClick={handleGoogleSignSignin}
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="w-5 h-5" />
              <span className='dark:text-gray-600'>Continue With Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - App info */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-8 lg:p-12 flex flex-col">
        <div className="mb-10">
          <Logo />
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Reflect on how you spend your day</h1>
          <p className="text-lg mb-10 text-purple-100">
            Journal throughout your day and get AI-powered insights on your productivity and patterns.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <FeatureCard 
              icon={<AlarmClock className="w-6 h-6" />}
              title="Custom Reminders"
              description="Set personalized reminders throughout your day to capture what you're doing"
            />
            <FeatureCard 
              icon={<Book className="w-6 h-6" />}
              title="AI Summaries"
              description="Get intelligent daily summaries based on your journal entries"
            />
            <FeatureCard 
              icon={<Calendar className="w-6 h-6" />}
              title="Streak Calendar"
              description="Track productive days with a visual calendar view"
            />
            <FeatureCard 
              icon={<Clock className="w-6 h-6" />}
              title="Time Insights"
              description="Learn how you spend your time with detailed analytics"
            />
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-sm text-purple-200">
            © 2025 Daily Journal • <a href="#" className="underline hover:text-white transition-colors duration-200">Privacy Policy</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default SignupPage;