'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {

  const router = useRouter();

  const [summaries, setSummaries] = useState('');

  useEffect(() => {

    const fetchSummaries = async () => {

      try {
        const response = await axios.get('/api/allSummaries')
        const allSummaries = response.data.summaries;

        const events = allSummaries.map((summary : any) => {
          const title = summary.content.split('\n')[0]
          const localDate = new Date(summary.createdAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); 

          return {
            id: summary.id,
            title: title,
            date: localDate,
            color: title === 'Unproductive Day' ? '#ff0000' : '#0000ff',
          }
        })

        setSummaries(events);

      } catch (error: any) {

        console.log("Error fetching summaries", error);
        
      }
      
    }

    fetchSummaries();

  }, [])

  return (
    <div className=''>
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        events={summaries}
        eventClick={(info) => {
          const id = info.event.id
          router.push(`/summary?generated=false&id=${id}`)
        }}
        contentHeight={650}
        eventDidMount={(info) => {
          info.el.style.cursor = 'pointer'
        }}
      />
    </div>
  );
}