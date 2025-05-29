import { Candidate, FilterPlan, RankPlan, Stats } from '../types';

export const readCSV = async (): Promise<Candidate[]> => {
  try {
    // Use Vercel URL in production, fallback to localhost in development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(new URL('/api/candidates', baseUrl));
    const { candidates } = await response.json();
    
    if (!candidates || !Array.isArray(candidates)) {
      console.error('No candidates data received or invalid format');
      return [];
    }
    
    return candidates;
  } catch (error) {
    console.error('Error reading candidates:', error);
    return [];
  }
};

export const filterCandidates = (plan: FilterPlan, candidates: Candidate[]): Candidate[] => {
  let filtered = [...candidates];
  
  if (plan.include) {
    Object.entries(plan.include).forEach(([key, value]) => {
      if (typeof value === 'string' || Array.isArray(value)) {
        filtered = filtered.filter(candidate => {
          const candidateValue = (candidate[key as keyof Candidate] || '').toString().toLowerCase().trim().replace(/\s+/g, ' ');
          
          let matches = false;
          if (Array.isArray(value)) {
            matches = value.some(val => {
              const filterVal = val.toLowerCase().trim().replace(/\s+/g, ' ');
              return candidateValue === filterVal ||
                     candidateValue.includes(filterVal) ||
                     filterVal.includes(candidateValue);
            });
          } else {
            const filterVal = value.toLowerCase().trim().replace(/\s+/g, ' ');
            matches = candidateValue === filterVal ||
                      candidateValue.includes(filterVal) ||
                      filterVal.includes(candidateValue);
          }
          
          return matches;
        });
      } else if (typeof value === 'number') {
        filtered = filtered.filter(candidate => {
          const candidateValue = candidate[key as keyof Candidate];
          return typeof candidateValue === 'number' && candidateValue >= value;
        });
      } else if (typeof value === 'boolean') {
        filtered = filtered.filter(candidate => {
          return candidate[key as keyof Candidate] === value;
        });
      }
    });
  }

  if (plan.exclude) {
    Object.entries(plan.exclude).forEach(([key, value]) => {
      if (typeof value === 'string') {
        filtered = filtered.filter(candidate => {
          const candidateValue = (candidate[key as keyof Candidate] || '').toString().toLowerCase();
          
          let matches = false;
          if (key === 'skills') {
            matches = !candidateValue.split(';').some(skill => skill.trim().toLowerCase().includes(value.toLowerCase()));
          } else if (key === 'location') {
            matches = !candidateValue.toLowerCase().includes(value.toLowerCase());
          } else {
            matches = !candidateValue.includes(value.toLowerCase());
          }
          
          return matches;
        });
      }
    });
  }

  return filtered;
};

export const rankCandidates = (candidates: Candidate[], plan: RankPlan): Candidate[] => {
  const ranked = [...candidates];
  
  ranked.sort((a, b) => {
    // Primary sorting
    if (plan.primary) {
      const { field, order = 'desc' } = plan.primary;
      const aVal = a[field as keyof Candidate] || 0;
      const bVal = b[field as keyof Candidate] || 0;
      
      if (aVal !== bVal) {
        return order === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
      }
    }
    
    // Tie breakers
    if (plan.tie_breakers) {
      for (const tieBreaker of plan.tie_breakers) {
        const { field, order = 'desc' } = tieBreaker;
        const aVal = a[field as keyof Candidate] || 0;
        const bVal = b[field as keyof Candidate] || 0;
        
        if (aVal !== bVal) {
          return order === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
        }
      }
    }
    
    return 0;
  });
  
  return ranked;
};

export const aggregateStats = (candidates: Candidate[]): Stats => {
  if (!candidates.length) return { count: 0, avg_experience: 0, top_skills: [] };
  
  const totalExp = candidates.reduce((sum, c) => sum + c.years_experience, 0);
  const avgExp = totalExp / candidates.length;
  
  const skillsMap: Record<string, number> = {};
  candidates.forEach(c => {
    c.skills.split(';').forEach(skill => {
      skillsMap[skill] = (skillsMap[skill] || 0) + 1;
    });
  });
  
  const topSkills = Object.entries(skillsMap)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([skill]) => skill);
  
  return {
    count: candidates.length,
    avg_experience: parseFloat(avgExp.toFixed(1)),
    top_skills: topSkills
  };
}; 