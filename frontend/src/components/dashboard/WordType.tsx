import React, { useEffect, useState } from 'react';
import BasicTextFields from './Textbox'; // Assuming BasicTextFields is the updated TextField component

interface PrioritySectionProps {
  label: string;
  words: string[];
  onAddWord: (priority: string, word: string) => void;
  onDeleteWord: (priority: string, word: string) => void;
  priority: string;
}

const PrioritySection: React.FC<PrioritySectionProps> = ({ label, words = [], onAddWord, onDeleteWord, priority }) => {
    const [newWord, setNewWord] = useState('');
    const [wordToDelete, setWordToDelete] = useState('');
  
    const handleAddWord = () => {
      if (newWord.trim()) {
        onAddWord(priority, newWord);
        setNewWord(''); // Clear the input field
      }
    };
  
    const handleDeleteWord = () => {
      if (wordToDelete.trim()) {
        onDeleteWord(priority, wordToDelete);
        setWordToDelete(''); // Clear the input field
      }
    };
  
    return (
      <div className="flex flex-col items-center">
        {/* Add Word Section */}
        <BasicTextFields
          label={label}
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onSubmit={handleAddWord}
        />
  
        {/* Word Container */}
        <div
          className="border border-gray-400 rounded-md shadow-sm mt-3 p-2 h-[330px] overflow-y-auto"
          style={{
            width: '18ch',
          }}
        >
          {words.length > 0 ? (
            words.map((word, index) => (
              <p key={index} className="text-gray-700 text-sm">
                {word}
              </p>
            ))
          ) : (
            <p className="text-gray-700 text-sm">No words chosen</p>
          )}
        </div>
  
        {/* Delete Word Section */}
        <div className="mt-3">
        <BasicTextFields
            label={`Delete Word`}
            value={wordToDelete}
            onChange={(e) => setWordToDelete(e.target.value)}
            onSubmit={handleDeleteWord}
            buttonLabel="-" 
        />
        </div>
      </div>
    );
  };

  const KeyWords = () => {
    const [priorities, setPriorities] = useState<{ high: string[]; medium: string[]; low: string[] }>({
      high: [],
      medium: [],
      low: [],
    });
  
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/setting/get_settings', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.priorities?.word_type) {
          setPriorities({
            high: data.priorities.word_type.high || [],
            medium: data.priorities.word_type.medium || [],
            low: data.priorities.word_type.low || [],
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
  
    const addWordToDatabase = async (priority: string, word: string) => {
      try {
        const response = await fetch('http://localhost:5000/setting/add_word', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priority, word }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        await fetchSettings(); // Refetch settings after adding the word
      } catch (err) {
        console.error('Error adding word:', err);
      }
    };
  
    const deleteWordFromDatabase = async (priority: string, word: string) => {
      try {
        const response = await fetch('http://localhost:5000/setting/delete_word', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priority, word }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        await fetchSettings(); // Refetch settings after deleting the word
      } catch (err) {
        console.error('Error deleting word:', err);
      }
    };
  
    useEffect(() => {
      fetchSettings();
    }, []);
  
    return (
      <div>
        <div className="text-xl font-semibold text-center mb-4 mt-6">Key Words</div>
        <div className="flex flex-row justify-center gap-3">
          <PrioritySection
            label="High Priority"
            words={priorities.high}
            onAddWord={addWordToDatabase}
            onDeleteWord={deleteWordFromDatabase}
            priority="high"
          />
          <PrioritySection
            label="Medium Priority"
            words={priorities.medium}
            onAddWord={addWordToDatabase}
            onDeleteWord={deleteWordFromDatabase}
            priority="medium"
          />
          <PrioritySection
            label="Low Priority"
            words={priorities.low}
            onAddWord={addWordToDatabase}
            onDeleteWord={deleteWordFromDatabase}
            priority="low"
          />
        </div>
      </div>
    );
  };
  
  export default KeyWords;
  
