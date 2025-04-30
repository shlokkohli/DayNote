import { NotebookPen } from 'lucide-react';

const Logo = () => {
  return (
    <div className='max-w-[140px]'>
        <a href="/" className='flex gap-1 items-center'>
            <NotebookPen className='h-9 w-9' />
            <span className='text-2xl font-bold'>DayNote</span>
        </a>
    </div>
  )
}

export default Logo