import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarEvent } from '../types';
import { formatEventTime } from '../utility/dateUtils';
import Loader from './Loader';

function WeekBubble() {
    const [weekEvents, setWeekEvents] = useState<{ day: string; events: CalendarEvent[] }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    
    const fetchWeekEvents = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cal/week_events`, {
                withCredentials: true,
            });
    
            const sortedEvents = response.data.map((day: { day: string; events: CalendarEvent[] }) => ({
                ...day,
                events: day.events.sort((a, b) => {
                    const aTime = a.start.dateTime 
                        ? new Date(a.start.dateTime).getTime() 
                        : a.start.date 
                        ? new Date(a.start.date).getTime() 
                        : Infinity;
    
                    const bTime = b.start.dateTime 
                        ? new Date(b.start.dateTime).getTime() 
                        : b.start.date 
                        ? new Date(b.start.date).getTime() 
                        : Infinity;
    
                    return aTime - bTime;
                }),
            }));
    
            setWeekEvents(sortedEvents);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching week events:', error.response?.data || error.message);
            setError(error.response?.data || error.message);
        } finally {
            setLoading(false); // Stop loading
          }
    };
    
    useEffect(() => {
        fetchWeekEvents();
    }, []);

    return (
        <div
        className="relative mb-3 mx-2 border rounded-[30px] bg-[#a4cc8f] transition-transform duration-300 transform hover:scale-105 flex flex-col overflow-hidden"
        style={{
          height: 'calc(100vh - 350px)', // Adjust height based on available space
        }}
      >
        <div className="mt-5 text-lg text-center font-bold">Upcoming This Week</div>
  
        <div className="mx-3 mb-7 mt-3 mr-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#83ba67]">
          {weekEvents.map(
            (day) =>
              day.events.length > 0 && (
                <div key={day.day} className="mb-4">
                  <h2 className="mx-2 text-black font-bold">{day.day}</h2>
                  {day.events.map((event) => (
                    <div key={event.id} className="ml-5 flex items-start">
                      <span className="font-semibold text-gray-700 whitespace-nowrap">
                        ‣ &nbsp;{formatEventTime(event.start)}:
                      </span>
                      <span className="ml-2 flex-1">{event.summary}</span>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
  
        {loading && ( // Show loader overlay when loading
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20">
            <Loader color="#83ba67" /> 
          </div>
        )}
      </div>
    );
}

export default WeekBubble;

