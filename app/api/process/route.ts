import { NextResponse } from 'next/server';
import { readCSV, filterCandidates, rankCandidates } from '@/app/utils/candidateUtils';
import { FilterPlan, RankPlan } from '@/app/types';

export async function POST(request: Request) {
  try {
    const { query, csvHeader } = await request.json();
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Call the LLM API to get the filter and rank plans
    const llmResponse = await fetch(`${baseUrl}/api/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, csvHeader }),
    });

    if (!llmResponse.ok) {
      const errorData = await llmResponse.json();
      throw new Error(errorData.error || 'Failed to get LLM response');
    }

    const { filter_plan, rank_plan, summary } = await llmResponse.json();

    // Ensure the response has the correct structure
    if (!filter_plan || !rank_plan) {
      throw new Error('Invalid response structure from LLM');
    }

    // Create the filter_plan with proper structure matching FilterPlan type
    const filterPlan: FilterPlan = {
      include: {} as Record<string, string | number | boolean>,
      exclude: {} as Record<string, string>
    };

    // Add include filters
    if (filter_plan.include) {
      Object.entries(filter_plan.include).forEach(([key, value]) => {
        if (value !== undefined && value !== null && filterPlan.include) {
          filterPlan.include[key] = value as string | number | boolean;
        }
      });
    }

    // Add exclude filters
    if (filter_plan.exclude) {
      Object.entries(filter_plan.exclude).forEach(([key, value]) => {
        if (value !== undefined && value !== null && filterPlan.exclude) {
          filterPlan.exclude[key] = value as string;
        }
      });
    }

    // Remove empty objects
    if (filterPlan.include && Object.keys(filterPlan.include).length === 0) {
      delete filterPlan.include;
    }
    if (filterPlan.exclude && Object.keys(filterPlan.exclude).length === 0) {
      delete filterPlan.exclude;
    }

    // Create the rank_plan with proper structure
    const rankPlan: RankPlan = {
      primary: {
        field: rank_plan.primary?.field || 'years_experience',
        order: rank_plan.primary?.order || 'desc'
      }
    };

    // Add tie breakers if they exist
    if (rank_plan.tie_breakers && rank_plan.tie_breakers.length > 0) {
      rankPlan.tie_breakers = rank_plan.tie_breakers;
    }

    // Read and process the candidates
    const candidates = await readCSV();
    const filtered = filterCandidates(filterPlan, candidates);
    const ranked = rankCandidates(filtered, rankPlan);

    // If no candidates found, return the LLM's summary and suggestions
    if (filtered.length === 0) {
      return NextResponse.json({
        candidates: [],
        summary,
        filter_plan: filter_plan,
        rank_plan: rank_plan,
        metadata: {
          query,
          timestamp: new Date().toISOString(),
          version: '1.2'
        }
      });
    }

    // Prepare a summary prompt for the LLM
    const candidateSummary = ranked.slice(0, 20).map(c => ({
      full_name: c.full_name,
      title: c.title,
      location: c.location,
      years_experience: c.years_experience,
      skills: c.skills
    }));
    const summaryPrompt = `Given the following list of candidates, generate a concise, recruiter-friendly summary including the number of candidates, average years of experience, and top skills. Keep it short and easy to understand.\n\nCandidates:\n${JSON.stringify(candidateSummary, null, 2)}`;

    // Call the LLM to generate the summary
    const summaryResponse = await fetch(`${baseUrl}/api/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: summaryPrompt, csvHeader }),
    });

    if (!summaryResponse.ok) {
      throw new Error('Failed to get summary from LLM');
    }

    const summaryData = await summaryResponse.json();
    const generatedSummary = summaryData.summary || summaryData.text || summaryData.response || summaryData;

    return NextResponse.json({
      candidates: ranked,
      summary: generatedSummary,
      filter_plan: filter_plan,
      rank_plan: rank_plan,
      metadata: {
        query,
        timestamp: new Date().toISOString(),
        version: '1.2'
      }
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json({ error: 'Failed to process query' }, { status: 500 });
  }
} 