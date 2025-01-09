import { useState, useEffect } from 'react';
import axios from 'axios';

interface PriorityEvent {
    date: string; // ISO date string format
    event: string; // Event summary
}

interface FutureEvents {
    high_priority: PriorityEvent[];
    medium_priority: PriorityEvent[];
}

function FutureBubble() {
    const [futureEvents, setFutureEvents] = useState<FutureEvents | null>(null);
    const [futureWeeks, setFutureWeeks] = useState<number | null>(null); // For storing future_weeks
    const [error, setError] = useState<string | null>(null);

    const fetchFutureEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/cal/future_events', {
                withCredentials: true,
            });
            console.log("Fetched Data:", response.data);
            setFutureEvents(response.data); // Update state with fetched data
            setError(null);
        } catch (error: any) {
            console.error("Error fetching future events:", error.response?.data || error.message);
            setError(error.response?.data || error.message);
        }
    };

    const fetchWeeks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/setting/get_settings', {
                withCredentials: true, // Ensure credentials like cookies are sent
            });
            console.log(response)
            setFutureWeeks(response.data.future_weeks); // Update future_weeks state
        } catch (error: any) {
            console.error("Error fetching settings:", error.response?.data || error.message);
            setError(error.response?.data || error.message); // Store the error for display
        }
    };

    // Fetch events and settings when the component mounts
    useEffect(() => {
        fetchFutureEvents();
        fetchWeeks();
    }, []);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }; // Use 'short' for abbreviated months
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    
        const day = date.getDate();
        const suffix =
            day % 10 === 1 && day !== 11
                ? 'st'
                : day % 10 === 2 && day !== 12
                ? 'nd'
                : day % 10 === 3 && day !== 13
                ? 'rd'
                : 'th';
    
        return `${formattedDate}${suffix}`;
    };

    return (
        <div
            className="mb-3 mx-2 border rounded-[30px] bg-[#CDBACF] transition-transform duration-300 transform hover:scale-105 flex flex-col overflow-hidden"
            style={{
                height: 'calc(100vh - 350px)',
            }}
        >
            <div className="mt-5 text-lg text-center font-bold">Future at a Glance</div>

            <div className="mx-3 mb-7 mt-3 mr-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#ac8db0]">
                {error && <div className="text-red-500 text-center">{error}</div>}

                {futureEvents ? (
                    <>
                        {/* High Priority Events */}
                        <div>
                            <h2 className="mx-1 mb-2 text-black font-bold text-center">Highest priority events in the next {futureWeeks} weeks</h2>
                            {futureEvents.high_priority.map((event, index) => (
                                <div key={index} className="ml-4 pr-1 mb-1 flex items-start">
                                    <span className="font-semibold text-gray-700 whitespace-nowrap">
                                        ‣ &nbsp;{formatDate(event.date)}:
                                    </span>
                                    <span className="ml-2 flex-1">{event.event}</span>
                                </div>
                            ))}
                        </div>

                        {/* Medium Priority Events */}
                        <div>
                            <h2 className="mx-1 mb-2 mt-4 text-black font-bold text-center">10 upcoming medium priority events</h2>
                            {futureEvents.medium_priority.map((event, index) => (
                                <div key={index} className="ml-4 pr-1 flex items-start mb-1">
                                    <span className="font-semibold text-gray-700 whitespace-nowrap">
                                        ‣ &nbsp;{formatDate(event.date)}:
                                    </span>
                                    <span className="ml-2 flex-1">{event.event}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-gray-500 text-center">
                        No future events to display.
                    </div>
                )}
            </div>
        </div>
    );
}

export default FutureBubble;
