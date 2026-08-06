import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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
      // In-memory / dataUrl fallback response if token is not yet configured locally
      const buffer = Buffer.from(await file.arrayBuffer());
      imageUrl = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({ id: badgeId, url: imageUrl, name });
  } catch (error) {
    console.error('Error uploading badge to Vercel Blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
