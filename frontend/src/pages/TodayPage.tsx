import React from 'react';
import Navbar from '../components/Navbar';
import SummaryBubble from '../components/SummaryBubble';
import HelloBubble from '../components/HelloBubble';

const TodayPage = () => {

  const data = [
    { id: 1, name: 'Up on the Agenda Today', backgroundColor: '#F2B391', content: '' },
    { id: 2, name: 'Upcoming Week', backgroundColor: '#A4CC8F', content: '' },
    { id: 3, name: 'Future at a Glance', backgroundColor: '#CDBACF', content: '' },
    { id: 4, name: 'Suggested TO-DO', backgroundColor: '#85D4FF', content: '' },
  ];

  return (
    <>
    <Navbar/> 
    <div className="px-[100px]">
      <HelloBubble />

      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {data.map((summary) => (
          <div className="" key={summary.id}>
            <SummaryBubble 
              name={summary.name} 
              content={summary.content} 
              backgroundColor={summary.backgroundColor} 
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TodayPage;

