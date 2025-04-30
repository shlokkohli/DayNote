'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { 
        setMounted(true);
    }, [])

    if(!mounted) return null;
    
  return (
    <button className="p-2 rounded-full h-11 w-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>

      {theme === 'dark' ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6 text-gray-600" />
      )}
    </button>
  )
}

export default ThemeToggle;