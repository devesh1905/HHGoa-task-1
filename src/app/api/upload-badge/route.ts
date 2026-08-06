import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const memoryStore = (globalThis as unknown as { _badgeStore?: Map<string, { buffer: Buffer; mime: string }> })._badgeStore || 
  ((globalThis as unknown as { _badgeStore: Map<string, { buffer: Buffer; mime: string }> })._badgeStore = new Map());

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    const name = (formData.get('name') as string) || 'Builder';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const badgeId = Math.random().toString(36).substring(2, 10);
    const filename = `badges/${badgeId}.png`;

    let imageUrl = '';
    
    // Check if BLOB_READ_WRITE_TOKEN is configured in environment
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: 'public',
      });
      imageUrl = blob.url;
    } else {
      // Save to shared memory store for local development/deployment before token setup
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      memoryStore.set(badgeId, { buffer, mime: 'image/png' });
      
      const host = request.headers.get('host') || 'hhgoa-id-generator.vercel.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      imageUrl = `${protocol}://${host}/api/badge-image/${badgeId}`;
    }

    return NextResponse.json({ id: badgeId, url: imageUrl, name });
  } catch (error) {
    console.error('Error uploading badge to Vercel Blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
