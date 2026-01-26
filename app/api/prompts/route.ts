import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const items = db.prepare('SELECT * FROM prompts ORDER BY timestamp DESC').all();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { id, text, timestamp } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    // Check for duplicates
    const existing = db.prepare('SELECT 1 FROM prompts WHERE text = ?').get(text);
    
    if (!existing) {
      const stmt = db.prepare('INSERT INTO prompts (id, text, timestamp) VALUES (?, ?, ?)');
      stmt.run(id, text, timestamp);
    }
    
    return NextResponse.json({ success: true, saved: !existing });
  } catch (error) {
    console.error('Failed to save prompt:', error);
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
  }
}
