import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';

// Define the structure for fetched calendar data
interface Calendar {
  summary: string;
  calendarID: string;
  priority: string;
}

const CalendarType: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendars = async () => {
    try {
      const response = await fetch('http://localhost:5000/setting/get_settings', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Initialize fetched calendars with default "none" priority
      const fetchedCalendars = (data.calendars || []).map((calendar: any) => ({
        ...calendar,
        priority: 'none',
      }));

      // Define the type for calendar priorities
      const priorities = data.priorities?.calendar_type as Record<string, string[]>;

      // Merge fetched calendars with priorities from the database
      Object.entries(priorities || {}).forEach(([priority, calendarIDs]) => {
        (calendarIDs as string[]).forEach((id) => {
          const calendar = fetchedCalendars.find((c: { calendarID: string; }) => c.calendarID === id);
          if (calendar) calendar.priority = priority;
        });
      });

      setCalendars(fetchedCalendars);
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError((err as Error).message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const deleteCalendarFromPriority = async (calendarID: string, priority: string) => {
    try {
      const response = await fetch('http://localhost:5000/setting/delete_calendar', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendar: calendarID,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      console.log(`Successfully removed ${calendarID} from ${priority}`);
    } catch (err) {
      console.error('Error deleting calendar from priority:', err);
    }
  };

  const updateCalendarPriority = async (index: number, newPriority: string) => {
    const calendar = calendars[index];
    const currentPriority = calendar.priority;

    if (currentPriority !== 'none') {
      await deleteCalendarFromPriority(calendar.calendarID, currentPriority);
    }

    if (newPriority === 'none') {
      // Remove calendar priority locally
      const updatedCalendars = [...calendars];
      updatedCalendars[index].priority = 'none';
      setCalendars(updatedCalendars);
      console.log(`Removed calendar ${calendar.calendarID} from all priorities.`);
      return; // Exit since no new priority is added
    }

    try {
      const response = await fetch('http://localhost:5000/setting/add_calendar', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendar: calendar.calendarID,
          priority: newPriority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      console.log(`Successfully added ${calendar.calendarID} to ${newPriority}`);

      // Update the calendar priority locally
      const updatedCalendars = [...calendars];
      updatedCalendars[index].priority = newPriority;
      setCalendars(updatedCalendars);
    } catch (err) {
      console.error('Error updating calendar priority:', err);
    }
  };

  const handlePriorityChange = (index: number, newPriority: string) => {
    updateCalendarPriority(index, newPriority);
  };

  return (
    <div className="p-4 w-[530px]">
      <h2 className="text-xl font-semibold mb-4 text-center">Calendars</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div>
          {/* Header Row for Labels */}
          <div className="flex items-center gap-4 mb-4">
            <span className="w-1/2 text-gray-700 font-semibold">Calendar</span>
            <div className="flex w-1/2 justify-around">
              <span className="text-gray-700 font-semibold">Low</span>
              <span className="text-gray-700 font-semibold">Medium</span>
              <span className="text-gray-700 font-semibold">High</span>
              <span className="text-gray-700 font-semibold pl-5">None</span>
            </div>
          </div>

          {/* Calendar Rows */}
          <ul className="list-none">
            {calendars.map((calendar, index) => (
              <li key={index} className="flex items-center gap-8 -mb-1">
                {/* Calendar Name */}
                <span className="w-1/2 text-gray-700">{calendar.summary}</span>

                {/* Radio Buttons */}
                <div className="flex w-1/2 justify-around gap-4">
                  <Radio
                    checked={calendar.priority === 'low'}
                    onChange={() => handlePriorityChange(index, 'low')}
                    value="low"
                    name={`priority-radio-${index}`}
                    inputProps={{ 'aria-label': 'Low Priority' }}
                  />
                  <Radio
                    checked={calendar.priority === 'medium'}
                    onChange={() => handlePriorityChange(index, 'medium')}
                    value="medium"
                    name={`priority-radio-${index}`}
                    inputProps={{ 'aria-label': 'Medium Priority' }}
                  />
                  <Radio
                    checked={calendar.priority === 'high'}
                    onChange={() => handlePriorityChange(index, 'high')}
                    value="high"
                    name={`priority-radio-${index}`}
                    inputProps={{ 'aria-label': 'High Priority' }}
                  />
                  <div className="pl-5">
                  <Radio
                    checked={calendar.priority === 'none'}
                    onChange={() => handlePriorityChange(index, 'none')}
                    value="none"
                    name={`priority-radio-${index}`}
                    inputProps={{ 'aria-label': 'None' }}
                  />
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarType;

