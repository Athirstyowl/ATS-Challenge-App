import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { candidates, query } = await request.json();

    const prompt = `Given the following top candidates and the original query, generate a recruiter-friendly summary.
    
Original Query: ${query}
Top Candidates:
${JSON.stringify(candidates, null, 2)}

Generate a concise, professional summary that highlights why these candidates are the best matches for the query.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
      throw new Error('No content received from Gemini');
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
} 