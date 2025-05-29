"use client";

import React, { useState, useEffect } from 'react';
import { Candidate, TimelineStep, ChatMessage } from './types';
import ATSLayout from './components/templates/ATSLayout';
import { ChatPanel } from './components/organisms/ChatPanel';
import { CandidateList } from './components/organisms/CandidateList';
import CandidateModal from './components/organisms/CandidateModal';

// Helper function to parse CSV data
const parseCSV = (csvData: string): Candidate[] => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const candidate: Record<string, string | number> = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      // Convert numeric values
      if (header === 'years_experience' || header === 'availability_weeks' || 
          header === 'notice_period_weeks' || header === 'desired_salary_usd' || 
          header === 'remote_experience_years') {
        candidate[header] = value ? parseFloat(value) : 0;
      } else {
        candidate[header] = value || '';
      }
    });
    
    return candidate as unknown as Candidate;
  }).filter(candidate => candidate.id); // Filter out empty lines
};

export default function ATSChallengeApp() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm ATS-Lite. Ask me to find candidates using natural language like 'Backend engineers in Germany, most experience first' and I'll show you how I think through the search." }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);

  useEffect(() => {
    // Fetch candidates on component mount
    console.log('Fetching initial candidates...');
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        console.log('Initial candidates response:', data);
        try {
          // Check if data.data exists and is a string
          if (typeof data.data === 'string') {
            console.log('Parsing initial CSV data:', data.data);
            const parsedCandidates = parseCSV(data.data);
            console.log('Parsed initial candidates:', parsedCandidates);
            setCandidates(parsedCandidates);
          } else if (Array.isArray(data.candidates)) {
            console.log('Using initial candidates array:', data.candidates);
            setCandidates(data.candidates);
          } else {
            console.error('Unexpected initial API response format:', data);
            setCandidates([]);
          }
        } catch (error) {
          console.error('Error parsing initial candidates data:', error);
          setCandidates([]);
        }
      })
      .catch(error => {
        console.error('Error fetching initial candidates:', error);
        setCandidates([]);
      });
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    
    // Add thinking message
    setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);

    try {
      // Check if the query is a phone number or contact information
      if (query.match(/^\d{10}$/) || query.toLowerCase().includes('call me') || query.toLowerCase().includes('contact me')) {
        // Remove thinking message and add response
        setMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.content !== 'Thinking...');
          return [...withoutThinking, { 
            role: 'assistant', 
            content: "I'm an AI assistant and cannot make phone calls. I can help you search for candidates based on their skills, experience, location, and other professional criteria. Please try a search query like 'Backend engineers in Germany' or 'Frontend developers with React experience'." 
          }];
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const data = await response.json();
      let aiResponse = '';

      // Update candidates list
      if (Array.isArray(data.candidates)) {
        setCandidates(data.candidates);
      } else if (typeof data.data === 'string') {
        const parsedCandidates = parseCSV(data.data);
        setCandidates(parsedCandidates);
      } else {
        setCandidates([]);
      }

      if (typeof data.summary === 'object' && data.summary !== null) {
        // Handle object response
        const { count, message, suggestions } = data.summary;
        aiResponse = message || "Here are the results I found.";
        
        if (count !== undefined) {
          aiResponse += ` Found ${count} candidates.`;
        }
        
        if (Array.isArray(suggestions) && suggestions.length > 0) {
          aiResponse += "\n\nSuggestions to improve your search:";
          suggestions.forEach(suggestion => {
            aiResponse += `\n• ${suggestion}`;
          });
        }
      } else if (typeof data.summary === 'string') {
        // Handle string response
        aiResponse = data.summary;
      }
      
      // Remove thinking message and add response
      setMessages(prev => {
        const withoutThinking = prev.filter(msg => msg.content !== 'Thinking...');
        return [...withoutThinking, { role: 'assistant', content: aiResponse }];
      });

      // Update timeline with the search event
      setTimeline(prev => [
        {
          id: prev.length + 1,
          title: 'Search Performed',
          description: query,
          timestamp: new Date().toLocaleTimeString(),
          status: 'completed',
          type: 'search',
          content: query
        },
        ...prev
      ]);

    } catch (error) {
      console.error('Error processing query:', error);
      // Remove thinking message and add error message
      setMessages(prev => {
        const withoutThinking = prev.filter(msg => msg.content !== 'Thinking...');
        return [...withoutThinking, { 
          role: 'assistant', 
          content: "I apologize, but I encountered an error while processing your request. Please try a different search query or try again later." 
        }];
      });
      setCandidates([]); // Reset candidates on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ATSLayout
      header={<div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-indigo-700">ATS-Lite</h1>
      </div>}
      chatPanel={
        <ChatPanel
          messages={messages}
          query={query}
          isProcessing={loading}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
        />
      }
      candidateList={
        <CandidateList
          candidates={candidates}
          onCandidateSelect={setSelectedCandidate}
        />
      }
      timeline={timeline}
      modal={
        selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )
      }
    />
  );
}