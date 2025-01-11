import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';

// Define the Todo interface
interface Todo {
  id: string; // Unique identifier
  task: string; // Description of the task
  date: string; // ISO date string format
}

function TodoBubble() {
  const [weekEvents, setWeekEvents] = useState<Todo[]>([]); // List of events
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({}); // Completion status
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch events from the backend
  const fetchToDo = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:5000/cal/to_do', {
        withCredentials: true, // Ensure credentials are sent
      });
      setWeekEvents(response.data); // Update state with fetched events
    } catch (error) {
      console.error('Error fetching to-do events:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchToDo();
  }, []);

  // Toggle the completion status of a task
  const toggleTaskCompletion = (id: string) => {
    setCompletedTasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the completed status
    }));
  };

  // Remove a task from the list
  const removeTask = (id: string) => {
    setWeekEvents((prevState) => prevState.filter((event) => event.id !== id));
  };

  return (
    <div
      className="relative mb-3 mx-2 border rounded-[30px] bg-[#85D4FF] transition-transform duration-300 transform hover:scale-105 flex flex-col overflow-hidden"
      style={{
        height: 'calc(100vh - 350px)', // Adjust height based on available space
      }}
    >
      {/* Title */}
      <div className="mt-5 text-lg text-center font-bold">Suggested To-Do</div>

      {/* Content */}
      <div className="mx-3 mb-7 mt-3 mr-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#619dbe] pl-3">
        {weekEvents.length > 0 ? (
          weekEvents.map((event) => (
            <div
              key={event.id}
              className="mb-3 flex items-center justify-between"
            >
              <div
                className={`flex items-center ${
                  completedTasks[event.id] ? 'line-through text-gray-500' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={completedTasks[event.id] || false}
                  onChange={() => toggleTaskCompletion(event.id)}
                  className="mt-1 mr-2"
                />
                <span className="flex-1">{event.task}</span>
              </div>
              <button
                onClick={() => removeTask(event.id)}
                className="ml-4 mr-4 text-[#b25d5d] hover:text-[#45799a] font-bold"
              >
                X
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No events scheduled.</div>
        )}
      </div>

      {loading && ( // Show loader overlay when loading
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20">
          <Loader color="#619dbe" /> 
        </div>
      )}
    </div>
  );
}

export default TodoBubble;
