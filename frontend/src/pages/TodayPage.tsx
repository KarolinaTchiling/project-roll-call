import React from 'react';
import SummaryBubble from '../components/SummaryBubble';

const TodayPage = () => {
  const data = [
    { id: 1, name: 'Up on the Agenda Today', backgroundColor: '#F2B391', content: '' },
    { id: 2, name: 'Upcoming Week', backgroundColor: '#A4CC8F', content: '' },
    { id: 3, name: 'Future at a Glance', backgroundColor: '#CDBACF', content: '' },
    { id: 4, name: 'Suggested TO-DO', backgroundColor: '#85D4FF', content: '' },
  ];

  return (
    <div className="px-[100px]">

      <div className="bg-orange border rounded-full text-center mx-[150px] my-10">
        <div className="text-4xl font-bold p-3"> Hello Sara</div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
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
  );
};

export default TodayPage;


