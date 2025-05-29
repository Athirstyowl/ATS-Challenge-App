import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Timeline from '../organisms/Timeline';
import { TimelineStep } from '../../types';

interface ATSLayoutProps {
  header: ReactNode;
  chatPanel: ReactNode;
  candidateList: ReactNode;
  timeline: TimelineStep[];
  modal: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ATSLayout({
  header,
  chatPanel,
  candidateList,
  timeline,
  modal,
}: ATSLayoutProps) {
  return (
    <motion.div
      className="flex h-screen bg-gray-50 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {header}
        </motion.div>

        {/* Chat Area */}
        <motion.div 
          className="flex-1 flex overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {chatPanel}
          {candidateList}
        </motion.div>
      </div>

      {/* Timeline Sidebar */}
      <motion.div 
        className="w-80 border-l border-gray-200 overflow-hidden"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      >
        <Timeline steps={timeline} />
      </motion.div>

      {/* Modal */}
      {modal}
    </motion.div>
  );
} 