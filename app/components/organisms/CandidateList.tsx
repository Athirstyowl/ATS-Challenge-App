import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '@/app/types';
import { CandidateCard } from '../molecules/CandidateCard';

interface CandidateListProps {
  candidates: Candidate[];
  onCandidateSelect: (candidate: Candidate) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const CandidateList = ({ candidates, onCandidateSelect }: CandidateListProps) => {
  return (
    <motion.div
      className="w-1/2 flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">
          Candidates ({candidates.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <div className="space-y-2">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "#f8fafc"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <CandidateCard
                  candidate={candidate}
                  index={index}
                  onClick={onCandidateSelect}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 