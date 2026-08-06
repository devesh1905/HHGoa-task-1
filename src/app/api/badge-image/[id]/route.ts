import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// In-memory fallback map for local development when BLOB_READ_WRITE_TOKEN is not set
const memoryStore = (globalThis as unknown as { _badgeStore?: Map<string, { buffer: Buffer; mime: string }> })._badgeStore || 
  ((globalThis as unknown as { _badgeStore: Map<string, { buffer: Buffer; mime: string }> })._badgeStore = new Map());

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Try Vercel Blob if token exists
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: `badges/${id}` });
      if (blobs.length > 0) {
        const imgRes = await fetch(blobs[0].url);
        const arrayBuffer = await imgRes.arrayBuffer();
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (e) {
      console.error('Error fetching blob image in raw endpoint:', e);
    }
  }

  // 2. Try memory store fallback
  const cached = memoryStore.get(id);
  if (cached) {
    return new NextResponse(cached.buffer, {
      headers: {
        'Content-Type': cached.mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  return new NextResponse('Badge image not found', { status: 404 });
}
