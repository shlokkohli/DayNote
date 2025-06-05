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
        const response = await axios.get('/api/userSummaries')
        console.log(response)
        const allSummaries = response.data.summaries;

        console.log(allSummaries[0].content)

        const events = allSummaries.map((summary : any) => {
          const title = summary.content.split('\n')[0]
          return {
            id: summary.id,
            title: title,
            date: summary.createdAt.split('T')[0],
            color: title === 'Unproductive Day' ? '#ff0000' : '#0000ff',
          }
        })

        setSummaries(events);

      } catch (error) {

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
          router.push('/summary?generated=false')
          console.log(info)
        }}
        contentHeight={650}
        eventDidMount={(info) => {
          info.el.style.cursor = 'pointer'
        }}
      />
    </div>
  );
}