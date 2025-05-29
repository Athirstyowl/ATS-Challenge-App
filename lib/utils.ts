interface Candidate {
  id: number;
  experience: number;
  skills: string[];
}

export const sortCandidates = (
  candidates: Candidate[],
  sortBy: keyof Candidate,
  direction: 'asc' | 'desc' = 'desc'
): Candidate[] => {
  return [...candidates].sort((a, b) => {
    if (direction === 'desc') {
      return b[sortBy] > a[sortBy] ? 1 : -1;
    }
    return a[sortBy] > b[sortBy] ? 1 : -1;
  });
}; 