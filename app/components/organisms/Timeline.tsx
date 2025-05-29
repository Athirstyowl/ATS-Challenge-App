import { motion } from 'framer-motion';
import { TimelineStep } from '@/app/types';

interface TimelineProps {
  steps: TimelineStep[];
}

const stepVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const lineVariants = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function Timeline({ steps }: TimelineProps) {
  return (
    <motion.div 
      className="h-full p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-lg font-semibold mb-6 text-indigo-700">Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <motion.div
          className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"
          variants={lineVariants}
          initial="initial"
          animate="animate"
        />
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative pl-10"
              custom={index}
              variants={stepVariants}
              initial="initial"
              animate="animate"
            >
              {/* Dot */}
              <motion.div
                className="absolute left-3 w-3 h-3 rounded-full bg-indigo-500"
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              
              {/* Content */}
              <motion.div
                className="bg-white p-4 rounded-lg shadow-sm"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="font-medium text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {step.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">{step.timestamp}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 