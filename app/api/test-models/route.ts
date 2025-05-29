import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    // Get model info
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      },
    });
    
    // Test a simple generation to verify the model works
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: "Hello" }] }],
    });
    const response = await result.response;
    
    return NextResponse.json({
      modelInfo: {
        name: "gemini-1.5-flash",
        status: "working",
        response: response.text()
      }
    });
  } catch (error) {
    console.error('Error testing model:', error);
    return NextResponse.json({ 
      error: 'Failed to test model',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 