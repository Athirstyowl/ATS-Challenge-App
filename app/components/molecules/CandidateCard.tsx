import { Candidate } from '@/app/types';
import { Icon } from '../atoms/Icon';
import { MapPin, Clock } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onClick: (candidate: Candidate) => void;
}

export const CandidateCard = ({ candidate, index, onClick }: CandidateCardProps) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-indigo-200"
      onClick={() => onClick(candidate)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{candidate.full_name}</h4>
          <p className="text-sm text-gray-600">{candidate.title}</p>
          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Icon icon={MapPin} size={12} className="mr-1 text-indigo-400" />
              {candidate.location.replace(/^"|"$/g, '')}
            </span>
            <span className="flex items-center">
              <Icon icon={Clock} size={12} className="mr-1 text-indigo-400" />
              {candidate.years_experience || 0}y
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-indigo-600">#{index + 1}</div>
        </div>
      </div>
    </div>
  );
}; 