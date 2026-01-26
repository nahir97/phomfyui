import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const items = db.prepare('SELECT * FROM gallery ORDER BY timestamp DESC LIMIT ? OFFSET ?').all(limit, offset);
    
    // Parse workflow JSON for each item
    const parsedItems = items.map((item: any) => ({
      ...item,
      workflow: JSON.parse(item.workflow)
    }));

    return NextResponse.json(parsedItems);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    
    const stmt = db.prepare(`
      INSERT INTO gallery (id, url, prompt, timestamp, workflow)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      item.id,
      item.url,
      item.prompt,
      item.timestamp,
      JSON.stringify(item.workflow)
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save to gallery:', error);
    return NextResponse.json({ error: 'Failed to save to gallery' }, { status: 500 });
  }
}
