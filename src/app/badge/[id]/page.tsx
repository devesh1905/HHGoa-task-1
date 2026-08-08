import { Metadata } from 'next';
import Link from 'next/link';
import { list } from '@vercel/blob';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const sParams = await searchParams;
  const nameParam = (sParams.name as string) || 'Builder';

  let imageUrl = '';

  // If Vercel Blob token is available, resolve public blob URL
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: `badges/${id}` });
      if (blobs.length > 0) {
        imageUrl = blobs[0].url;
      }
    } catch (e) {
      console.error('Error fetching blob metadata:', e);
    }
  }

  const publicDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://hh-goa-task-1-green.vercel.app';

  if (!imageUrl) {
    imageUrl = `${publicDomain}/api/badge-image/${id}`;
  }

  const title = `${nameParam}'s Official HH Goa 2026 Builder Badge`;
  const description = `Check out ${nameParam}'s official Builder Badge for Hacker House Goa 2026! Built with 2:47 PM Studio ID Generator. #FrameInGoa`;
  const shareUrl = `${publicDomain}/badge/${id}?name=${encodeURIComponent(nameParam)}`;

  return {
    metadataBase: new URL(publicDomain),
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: 'Hacker House Goa 2026',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BadgePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  const nameParam = (sParams.name as string) || 'Builder';

  let imageUrl = `/api/badge-image/${id}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: `badges/${id}` });
      if (blobs.length > 0) {
        imageUrl = blobs[0].url;
      }
    } catch (e) {
      console.error('Error loading blob image:', e);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-green)', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/2-47.svg" alt="2:47 PM Studio" style={{ height: '22px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <img src="/hh_goa_header_logo.svg" alt="Hacker House Goa" style={{ height: '24px', width: 'auto' }} />
            <span className="font-display" style={{ color: 'var(--accent-yellow)', fontSize: '1.1rem', fontWeight: 700 }}>
              2026
            </span>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: '1.6rem', color: 'var(--card-cream)', margin: 0 }}>
          {nameParam.toUpperCase()}&apos;S BADGE
        </h1>

        {/* Display Badge Image */}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`${nameParam}'s Badge`} 
            style={{ 
              maxWidth: '100%', 
              borderRadius: '24px', 
              border: '4px solid var(--accent-yellow)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
            }} 
          />
        ) : (
          <div style={{ padding: '3rem 2rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '2px dashed var(--accent-pink)', color: 'var(--card-cream)' }}>
            <p className="font-mono" style={{ fontSize: '0.9rem' }}>✦ HH GOA 2026 BUILDER BADGE ✦</p>
          </div>
        )}

        <p style={{ color: 'rgba(251, 243, 227, 0.8)', fontSize: '0.95rem' }}>
          Official Pass for Hacker House Goa 2026 Edition.
        </p>

        {/* Return Button */}
        <Link href="/" className="btn-pink" style={{ textDecoration: 'none', width: '100%', padding: '0.85rem' }}>
          CREATE YOUR OWN BADGE ↗
        </Link>
      </div>
    </div>
  );
}
