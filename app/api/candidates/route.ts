import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Candidate } from '@/app/types';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'candidates.csv');
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    // Parse CSV
    const lines = fileContents.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or malformed');
    }

    const headers = lines[0].split(',');
    
    const candidates = lines.slice(1).map((line: string) => {
      if (!line.trim()) return null;
      
      // Handle quoted values properly
      const values: string[] = [];
      let currentValue = '';
      let insideQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim()); // Add the last value
      
      const candidate: Partial<Candidate> = {};
      
      headers.forEach((header: string, index: number) => {
        const value = values[index]?.trim();
        if (value === undefined) return;
        
        switch (header) {
          case 'id':
            candidate.id = parseInt(value) || 0;
            break;
          case 'years_experience':
          case 'availability_weeks':
          case 'notice_period_weeks':
          case 'desired_salary_usd':
          case 'remote_experience_years':
            const numValue = parseInt(value);
            if (isNaN(numValue)) {
              candidate[header] = 0;
            } else {
              candidate[header] = numValue;
            }
            break;
          case 'willing_to_relocate':
          case 'open_to_contract':
            candidate[header] = value.toLowerCase() === 'yes';
            break;
          case 'title':
          case 'location':
            // Remove quotes and trim for these fields
            candidate[header] = value.replace(/^"|"$/g, '').trim();
            break;
          default:
            (candidate as Record<string, string | number | boolean>)[header] = value || '';
        }
      });
      
      return candidate as Candidate;
    }).filter((candidate: Candidate | null): candidate is Candidate => candidate !== null && 'id' in candidate);

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json({ error: 'Failed to read CSV file' }, { status: 500 });
  }
} 