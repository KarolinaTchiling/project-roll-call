import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarEvent } from '../types';
import { formatTime } from '../utility/dateUtils';

function TodayBubble() {
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchDayEvents = async () => {
      const response = await axios.get('http://127.0.0.1:5000/day_events');
      setDayEvents(response.data);
    };
    fetchDayEvents();
  }, []);

  const isEventPast = (endDateTime: string | undefined) => {
    if (!endDateTime) return false;
    return new Date(endDateTime) < new Date();
  };

  const areAllEventsPast = (events: CalendarEvent[]) => {
    return events.every(event => isEventPast(event.end.dateTime));
  };

  const isEventHappening = (startDateTime: string | undefined, endDateTime: string | undefined) => {
    if (!startDateTime || !endDateTime) return false;
    
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const now = new Date();

    return start <= now && now <= end;
  };

  const morningEvents = dayEvents.filter(event => event.start.dateTime && new Date(event.start.dateTime).getHours() < 12);
  const afternoonEvents = dayEvents.filter(event => event.start.dateTime && new Date(event.start.dateTime).getHours() >= 12 && new Date(event.start.dateTime).getHours() < 18);
  const eveningEvents = dayEvents.filter(event => event.start.dateTime && new Date(event.start.dateTime).getHours() >= 18);

  const renderEvents = (title: string, events: CalendarEvent[]) => (
    <div className={`mb-4`}>
      <h2 className={` mx-2 text-black font-bold ${areAllEventsPast(events) ? 'opacity-40' : ''}`} >{title}</h2>  
      {events.map((event) => (
        <div
          key={event.id}
          className={`ml-5 flex items-start ${isEventPast(event.end.dateTime) ? 'opacity-40' : ''}`}
        >
          <span className={`font-semibold whitespace-nowrap ${isEventHappening(event.start.dateTime, event.end.dateTime) ? 'text-blue-600' : 'text-gray-700'}`}>
            ‣ &nbsp;{formatTime(event.start.dateTime || '')}:
          </span>
          <span className={`ml-2 flex-1 font-normal whitespace-normal ${isEventHappening(event.start.dateTime, event.end.dateTime) ? 'text-blue-600' : 'text-black-700'}`}>
            {event.summary}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
      <div className="mx-2 border rounded-[30px] h-[420px] transition-transform duration-300 transform hover:scale-105 bg-[#F2B391]">
        <div className="mt-5 text-lg text-center font-bold">Up on the Agenda Today</div>

        <div className="mx-3 mt-3">
          {morningEvents.length > 0 && renderEvents('Morning', morningEvents)}
          {afternoonEvents.length > 0 && renderEvents('Afternoon', afternoonEvents)}
          {eveningEvents.length > 0 && renderEvents('Evening', eveningEvents)}
        </div>
      </div>
    </div>
  );
}

export default TodayBubble;