import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const GALLERY_FILE = path.join(process.cwd(), 'data', 'gallery.json');

async function ensureDataDir() {
  const dir = path.dirname(GALLERY_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    await ensureDataDir();
    
    let gallery = [];
    try {
      const data = await fs.readFile(GALLERY_FILE, 'utf8');
      gallery = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet
    }
    
    gallery = [item, ...gallery];
    await fs.writeFile(GALLERY_FILE, JSON.stringify(gallery, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save to gallery' }, { status: 500 });
  }
}
