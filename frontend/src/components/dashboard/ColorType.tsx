import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';

// Define the structure for calendar color data
interface CalendarColor {
  summary: string; // Display name for the color
  colorID: string; // Google Calendar color ID
  colorHex?: string; // Hex value for colors (undefined for primary calendar)
  priority: string; // Assigned priority (low, medium, high, none)
}

// Predefined Google Calendar Event Colors in Rainbow Order
const predefinedColors: CalendarColor[] = [
  { summary: 'Tomato', colorID: '11', colorHex: '#D50000', priority: 'none' },
  { summary: 'Tangerine', colorID: '6', colorHex: '#F4511E', priority: 'none' },
  { summary: 'Flamingo', colorID: '4', colorHex: '#E67C73', priority: 'none' },
  { summary: 'Banana', colorID: '5', colorHex: '#F6BF26', priority: 'none' },
  { summary: 'Sage', colorID: '2', colorHex: '#33B679', priority: 'none' },
  { summary: 'Basil', colorID: '10', colorHex: '#0B8043', priority: 'none' },
  { summary: 'Peacock', colorID: '7', colorHex: '#039BE5', priority: 'none' },
  { summary: 'Blueberry', colorID: '9', colorHex: '#3F51B5', priority: 'none' },
  { summary: 'Grape', colorID: '3', colorHex: '#8E24AA', priority: 'none' },
  { summary: 'Lavender', colorID: '1', colorHex: '#7986CB', priority: 'none' },
  { summary: 'Graphite', colorID: '8', colorHex: '#616161', priority: 'none' },
];

const ColorType: React.FC = () => {
  const [colors, setColors] = useState<CalendarColor[]>(predefinedColors);
  const [primaryCalendar, setPrimaryCalendar] = useState<CalendarColor | null>(null);

  const fetchColorsFromDB = async () => {
    try {
      const response = await fetch('http://localhost:5000/setting/get_settings', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const colorPriorities: Record<string, string[]> = data.priorities?.color_type || {};

      // Update priorities for predefined colors based on DB data
      const updatedColors = predefinedColors.map((color) => {
        for (const [priority, colorIDs] of Object.entries(colorPriorities)) {
          if (colorIDs.includes(color.colorID)) {
            return { ...color, priority };
          }
        }
        return color; // If no match, keep priority as 'none'
      });

      setColors(updatedColors);
    } catch (err) {
      console.error('Error fetching colors from DB:', err);
    }
  };

  const fetchPrimaryCalendar = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/primary_calendar', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const primaryCalendar: CalendarColor = {
        summary: 'Base Calendar Color',
        colorID: data.colorID || '0',
        priority: 'none',
      };

      setPrimaryCalendar(primaryCalendar);
    } catch (err) {
      console.error('Error fetching primary calendar:', err);
    }
  };

  useEffect(() => {
    fetchColorsFromDB();
    fetchPrimaryCalendar();
  }, []);

  useEffect(() => {
    if (primaryCalendar) {
      setColors((prevColors) => [...prevColors, primaryCalendar]);
    }
  }, [primaryCalendar]);

  const handlePriorityChange = async (index: number, newPriority: string) => {
    const color = colors[index];
    const currentPriority = color.priority;

    // Remove from current priority if exists
    if (currentPriority !== 'none') {
      await fetch('http://localhost:5000/setting/delete_color', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: currentPriority, color: color.colorID }),
      });
    }

    // Add to new priority if not 'none'
    if (newPriority !== 'none') {
      await fetch('http://localhost:5000/setting/add_color', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority, color: color.colorID }),
      });
    }

    // Update priority locally
    const updatedColors = [...colors];
    updatedColors[index].priority = newPriority;
    setColors(updatedColors);
  };

  const renderColorRow = (color: CalendarColor, index: number) => (
    <li key={color.colorID} className="flex items-center justify-between -mb-1">
      {/* Color Circle and Name */}
      <div className="flex items-center gap-2 w-2/5">
        {color.colorHex ? (
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: color.colorHex }}
          ></div>
        ) : null}
        <span className="text-gray-700">{color.summary}</span>
      </div>

      {/* Radio Buttons */}
      <div className="flex w-3/5 justify-around gap-1">
        <Radio
          checked={color.priority === 'low'}
          onChange={() => handlePriorityChange(index, 'low')}
          value="low"
          name={`priority-radio-${index}`}
        />
        <Radio
          checked={color.priority === 'medium'}
          onChange={() => handlePriorityChange(index, 'medium')}
          value="medium"
          name={`priority-radio-${index}`}
        />
        <Radio
          checked={color.priority === 'high'}
          onChange={() => handlePriorityChange(index, 'high')}
          value="high"
          name={`priority-radio-${index}`}
        />
        <div className="pl-5">
        <Radio
          checked={color.priority === 'none'}
          onChange={() => handlePriorityChange(index, 'none')}
          value="none"
          name={`priority-radio-${index}`}
        />
        </div>
      </div>
    </li>
  );

  return (
    <div className="p-4 w-[530px]">
      <h2 className="text-xl font-semibold mb-4 text-center">Event Colors</h2>
      <div>
        {/* Header Row for Labels */}
        <div className="flex items-center justify-between mb-4">
          <span className="w-2/5 text-gray-700 font-semibold">Google Event Color</span>
          <div className="flex w-3/5 justify-around">
            <span className="text-gray-700 font-semibold">Low</span>
            <span className="text-gray-700 font-semibold">Medium</span>
            <span className="text-gray-700 font-semibold">High</span>
            <span className="text-gray-700 font-semibold pl-5">None</span>
          </div>
        </div>

        {/* Color Rows */}
        <ul className="list-none">
          {colors.map(renderColorRow)}
        </ul>
      </div>
    </div>
  );
};

export default ColorType;
