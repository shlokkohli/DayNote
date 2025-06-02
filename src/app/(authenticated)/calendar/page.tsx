'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  const summaries = [
    { id: '1', title: 'Wrote a blog post', date: '2025-06-02' },
    { id: '2', title: 'Gym + Studied DSA', date: '2025-06-03' },
    { id: '3', title: 'Built calendar UI', date: '2025-06-10' },
  ];

  return (
    <div className='max-h-screen'>
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        events={summaries}
        eventClick={(info) => {
          console.log(info.event.id)
        }}
      />
    </div>
  );
}