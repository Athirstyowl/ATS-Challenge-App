import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';

interface Candidate {
  id: string;
  full_name: string;
  title: string;
  location: string;
}

interface SearchResults {
  candidates: Candidate[];
  summary: {
    count: number;
    message: string;
    suggestions?: string[];
  };
  filter_plan: {
    include?: Record<string, string | string[]>;
    exclude?: Record<string, string | string[]>;
  };
  rank_plan: {
    primary: {
      field: string;
      order: 'asc' | 'desc';
    };
  };
  metadata: {
    query: string;
    timestamp: string;
    version: string;
  };
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { type: "spring", stiffness: 100 }
};

const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query; // Store the current query
    setQuery(''); // Clear the input immediately
    
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: currentQuery }]);
    
    // Add loading message
    setMessages(prev => [...prev, { type: 'assistant', content: '...', isLoading: true }]);
    
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentQuery }),
      });
      const data = await response.json();
      setResults(data);
      
      // Remove loading message and add response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, { type: 'assistant', content: data.summary.message }];
      });
    } catch (error) {
      console.error('Error:', error);
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, { type: 'assistant', content: 'Sorry, there was an error processing your request.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto p-4"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4 max-h-[60vh]">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <motion.div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <span>Thinking</span>
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.div>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full relative">
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="border p-2 rounded mb-4 w-full max-w-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center min-w-[100px]"
            whileHover={{ scale: 1.1, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {loading ? (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ClipLoader color="#ffffff" size={20} />
                <span>Searching...</span>
              </motion.div>
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </motion.form>

      <AnimatePresence mode="wait">
        {results && !loading && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow p-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h2 
                className="text-xl font-semibold mb-4"
                variants={itemAnimation}
              >
                Search Results
              </motion.h2>
              {results.candidates && results.candidates.length > 0 ? (
                <motion.div 
                  className="space-y-4"
                  variants={staggerContainer}
                >
                  {results.candidates.map((candidate) => (
                    <motion.div 
                      key={candidate.id} 
                      className="border-b pb-4"
                      variants={itemAnimation}
                      whileHover={{ x: 20, backgroundColor: "#f8fafc" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h3 className="font-medium">{candidate.full_name}</h3>
                      <p className="text-gray-600">{candidate.title}</p>
                      <p className="text-gray-500">{candidate.location}</p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-gray-600"
                  variants={itemAnimation}
                >
                  <p>{results.summary?.message}</p>
                  {results.summary?.suggestions && (
                    <motion.ul 
                      className="mt-2 list-disc list-inside"
                      variants={staggerContainer}
                    >
                      {results.summary.suggestions.map((suggestion, index) => (
                        <motion.li 
                          key={index}
                          variants={itemAnimation}
                          whileHover={{ x: 20, color: "#3B82F6" }}
                        >
                          {suggestion}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 