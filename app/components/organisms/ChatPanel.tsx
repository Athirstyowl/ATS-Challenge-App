import { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPanelProps {
  messages: ChatMessageType[];
  query: string;
  isProcessing: boolean;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => void;
}

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

export const ChatPanel = ({
  messages,
  query,
  isProcessing,
  onQueryChange,
  onSubmit,
}: ChatPanelProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit(query);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      onQueryChange('');
    }
  };

  return (
    <motion.div 
      className="w-1/2 flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-white"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-indigo-700">Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <motion.div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm">{message.content}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className="p-4 border-t"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex gap-2">
          <motion.input
            ref={inputRef}
            type="text"
            name="message"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Backend engineers in Germany, most experience first"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            disabled={isProcessing}
          />
          <motion.button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            disabled={!query.trim() || isProcessing}
          >
            Send
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press ⌘+Enter to send</p>
      </motion.form>
    </motion.div>
  );
}; 