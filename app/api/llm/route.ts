import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper function to remove undefined values from an object
function removeUndefinedValues<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues) as T;
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        result[key] = removeUndefinedValues(value);
      }
    }
    return result as T;
  }
  return obj;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `You are a helpful AI assistant that helps with candidate search. Given a user query, generate a filter plan and rank plan to find the most relevant candidates.

The filter plan should include:
1. include: Object with fields to match (string or array of strings for fields like title, location, skills)
2. exclude: Object with fields to exclude (string or array of strings for fields like title, location, skills)

The rank plan should include:
1. primary: Object with field and order (asc/desc)
2. tie_breakers: Array of objects with field and order (asc/desc)

Example response for query "Engineers in USA":
{
  "filter_plan": {
    "include": {
      "title": ["Frontend Engineer", "Backend Engineer", "QA Engineer", "DevOps Engineer", "Cloud Architect", "Product Engineer", "Mobile Developer"],
      "location": "USA"
    }
  },
  "rank_plan": {
    "primary": {
      "field": "years_experience",
      "order": "desc"
    }
  },
  "summary": {
    "count": 0,
    "message": "Found engineers in USA",
    "suggestions": []
  }
}

Important:
- Use string or array of strings for fields like title, location, and skills in filter_plan
- For title matching, use an array of possible titles if the query is broad (e.g., "Engineers")
- For location matching, use the country name (e.g., "USA" will match "San Francisco, USA")
- Return valid JSON only
- Omit undefined values

User query: ${query}`;

    try {
      // Use the Gemini 1.5 Flash model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        console.error('No content received from Gemini');
        return NextResponse.json({ error: 'No content received from Gemini' }, { status: 500 });
      }

      // Clean the response text to ensure it's valid JSON
      const cleanedText = text.trim()
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '')
        .replace(/^[^{]*/, '')  // Remove any text before the first {
        .replace(/[^}]*$/, ''); // Remove any text after the last }
      
      try {
        const jsonResponse = JSON.parse(cleanedText);
        
        // Remove undefined values from the response
        const cleanedResponse = removeUndefinedValues(jsonResponse);
        
        // Validate the response structure
        if (!cleanedResponse.filter_plan || !cleanedResponse.rank_plan) {
          console.error('Invalid response structure:', cleanedResponse);
          return NextResponse.json({ error: 'Invalid response structure from Gemini' }, { status: 500 });
        }

        return NextResponse.json(cleanedResponse);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.error('Raw response:', text);
        return NextResponse.json({ error: 'Invalid JSON response from Gemini' }, { status: 500 });
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      return NextResponse.json({ error: 'Failed to generate content with Gemini' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing LLM request:', error);
    return NextResponse.json({ error: 'Failed to process LLM request' }, { status: 500 });
  }
} 