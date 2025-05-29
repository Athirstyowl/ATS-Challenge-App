export interface Candidate {
  id: number;
  full_name: string;
  title: string;
  location: string;
  timezone: string;
  years_experience: number;
  skills: string;
  languages: string;
  education_level: string;
  degree_major: string;
  availability_weeks: number;
  willing_to_relocate: boolean;
  work_preference: string;
  notice_period_weeks: number;
  desired_salary_usd: number;
  open_to_contract: boolean;
  remote_experience_years: number;
  visa_status: string;
  citizenships: string;
  summary: string;
  tags: string;
  last_active: string;
  linkedin_url: string;
  github_url: string;
}

export interface FilterPlan {
  include?: {
    [key: string]: string | number | boolean | undefined;
  };
  exclude?: {
    [key: string]: string;
  };
}

export interface RankPlan {
  primary?: {
    field: string;
    order?: 'asc' | 'desc';
  };
  tie_breakers?: Array<{
    field: string;
    order?: 'asc' | 'desc';
  }>;
}

export interface Stats {
  count: number;
  avg_experience: number;
  top_skills: string[];
}

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'error';
  type: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
} 