import { NextResponse } from 'next/server';
import { searchTags } from '@/lib/tags';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ tags: [] });
  }

  // The service also checks length, but good to be explicit or just pass it through
  const tags = searchTags(query);
  
  return NextResponse.json({ tags }, {
    headers: {
      // Cache results for 1 minute client-side, 5 minutes stale
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
