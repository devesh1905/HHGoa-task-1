'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, Share2, Loader2, Camera, Sparkles, ExternalLink } from 'lucide-react';

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [stack, setStack] = useState('');
  const [title, setTitle] = useState('');
  const [vibe, setVibe] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Debounced title & vibe generation using Gemini API
  useEffect(() => {
    if (!stack || stack.trim().length < 2) {
      setTitle('');
      setVibe('');
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeneratingTitle(true);
      try {
        const res = await fetch('/api/generate-title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stack }),
        });
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.vibe) setVibe(data.vibe);
      } catch (err) {
        console.error('Error fetching title & vibe:', err);
      } finally {
        setIsGeneratingTitle(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [stack]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      await new Promise((r) => setTimeout(r, 150));

      const canvas = await htmlToImage.toCanvas(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const cleanName = (name || 'Builder').trim().replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `HH_Goa_2026_${cleanName}_Badge.png`;

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to export ID Card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    // Open tab synchronously on user click to prevent browser popup blocker
    const popup = window.open('about:blank', '_blank');

    try {
      setIsSharing(true);
      const canvas = await htmlToImage.toCanvas(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );

      if (!blob) throw new Error('Failed to generate image blob');

      // Upload rendered badge image to Vercel Blob API
      const formData = new FormData();
      formData.append('file', blob, 'badge.png');
      formData.append('name', name || 'Builder');

      const res = await fetch('/api/upload-badge', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      let shareUrl = window.location.origin;
      if (data.id) {
        shareUrl = `${window.location.origin}/badge/${data.id}?name=${encodeURIComponent(name || 'Builder')}`;
      }

      const caption = `Building at HH Goa 2026! Here is my official Builder Badge 🚀`;
      const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareUrl)}&hashtags=FrameInGoa`;
      
      if (popup) {
        popup.location.href = tweetIntent;
      } else {
        window.location.href = tweetIntent;
      }
    } catch (err) {
      console.error('Link-based share failed, utilizing fallback clipboard/download:', err);
      
      // Fallback: Copy to clipboard & download image if network upload fails
      try {
        const canvas = await htmlToImage.toCanvas(cardRef.current, { quality: 1.0, pixelRatio: 2 });
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            } catch (clipErr) {
              console.warn('Clipboard write failed:', clipErr);
            }
          }
        }, 'image/png');
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }

      const tweetText = encodeURIComponent(
        `Building at HH Goa 2026! Here is my official Builder Badge 🚀 #FrameInGoa`
      );
      const fallbackUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      if (popup) {
        popup.location.href = fallbackUrl;
      } else {
        window.location.href = fallbackUrl;
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-green)' }}>
      {/* --- HERO & MAIN CONTENT --- */}
      <main style={{ flex: 1, padding: '1.25rem 1.5rem', maxWidth: '1150px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Header Title Section with Overlapping Asset Treatment */}
        <div className="animate-enter stagger-1" style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="kicker-label yellow" style={{ justifyContent: 'center', marginBottom: '0.25rem' }}>
            <span>✦</span> SHORTLISTING TASK #1 <span>✦</span>
          </div>
          
          <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0.25rem 0' }}>
            {/* Combined Line: Hacker House + Overlapping Swaying Goa Hindi */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/Hacker house.png" 
                alt="Hacker House" 
                style={{ 
                  maxWidth: '90vw', 
                  width: '380px', 
                  height: 'auto', 
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' 
                }} 
              />
              {/* Overlapping Goa Hindi SVG sitting at the horizontal center gap between HACKER and HOUSE */}
              <img 
                src="/goa_hindi.svg" 
                alt="Goa" 
                className="animate-sway"
                style={{ 
                  position: 'absolute',
                  top: '42%',
                  left: '49%',
                  transform: 'translate(-50%, -50%)',
                  height: '56px', 
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 10px rgba(255,0,128,0.45))',
                  pointerEvents: 'none',
                  zIndex: 2
                }} 
              />
            </div>
            
            <h1 className="font-display" style={{ 
              fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)', 
              fontWeight: 800, 
              color: 'var(--card-cream)',
              lineHeight: 1.1,
              letterSpacing: '0.06em',
              margin: '0.6rem 0 0 0'
            }}>
              ID GENERATOR
            </h1>
          </div>
          
          <p style={{ color: 'rgba(251, 243, 227, 0.8)', fontSize: '0.925rem', maxWidth: '520px', margin: '0.25rem auto 0' }}>
            Upload your photo, input your stack, and instantly claim your official event badge for HH Goa 2026.
          </p>
        </div>

        {/* Workspace Layout - Compact for viewport fit */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.75rem',
          alignItems: 'center'
        }}>
          
          {/* LEFT: FORM INPUT CARD */}
          <div className="cream-card gold-frame-accent animate-enter stagger-2" style={{ padding: '1.5rem 1.75rem' }}>
            <div className="kicker-label" style={{ marginBottom: '0.25rem' }}>
              <span>✦</span> BUILDER DETAILS
            </div>
            
            <h2 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
              CREATE YOUR BADGE
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Photo Upload Area */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div 
                  className="avatar-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '115px', height: '115px' }}
                >
                  {photo ? (
                    <img src={photo} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-pink)', gap: '0.15rem' }}>
                      <Camera size={24} />
                      <span className="font-mono" style={{ fontSize: '0.6rem', fontWeight: 700 }}>UPLOAD PHOTO</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click circular frame to upload</span>
              </div>

              {/* Name Field */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                  YOUR NAME *
                </label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Alex Rivera" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  maxLength={28}
                  style={{ padding: '0.65rem 1rem', fontSize: '0.9rem', borderRadius: '16px' }}
                />
              </div>

              {/* Stack / Role Field */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
                  PRIMARY STACK / ROLE *
                </label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Python and rust builder" 
                  value={stack} 
                  onChange={(e) => setStack(e.target.value)}
                  maxLength={32}
                  style={{ padding: '0.65rem 1rem', fontSize: '0.9rem', borderRadius: '16px' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
                <button 
                  className="btn-pink" 
                  onClick={handleDownload}
                  disabled={!photo || !name || isDownloading}
                  style={{ width: '100%', padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
                >
                  {isDownloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
                  DOWNLOAD BADGE ↗
                </button>

                <button 
                  className="btn-outline" 
                  onClick={handleShare}
                  disabled={!photo || !name || isSharing}
                  style={{ width: '100%', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                  {isSharing ? <Loader2 size={16} className="spin" /> : <Share2 size={16} />} 
                  {isSharing ? 'GENERATING SHARE LINK...' : 'SHARE ON X (#FRAMEINGOA) ↗'}
                </button>
              </div>

              {/* Feature Bullet List */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(15, 76, 53, 0.1)' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: 'var(--accent-pink)' }}>✦</span> AI-generated builder title based on your stack
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: 'var(--accent-pink)' }}>✦</span> High-resolution PNG output ready for X
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* RIGHT: ID CARD LIVE PREVIEW */}
          <div className="animate-enter stagger-3" style={{ display: 'flex', justifyContent: 'center' }}>
            
            {/* The Badge Element exported by html-to-image */}
            <div 
              ref={cardRef}
              style={{
                width: '330px',
                height: '450px',
                backgroundColor: 'var(--bg-green)',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(245, 197, 24, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 29, 142, 0.1) 0%, transparent 40%)',
                borderRadius: '24px',
                border: '4px solid var(--accent-yellow)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--card-cream)',
                fontFamily: 'var(--font-body), sans-serif'
              }}
            >
              {/* Header Branding */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '0.75rem 1.15rem',
                borderBottom: '2px dashed var(--accent-pink)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img 
                    src="/2-47.svg" 
                    alt="2:47 PM Studio" 
                    style={{ height: '14px', width: 'auto' }} 
                  />
                  <span className="font-display" style={{ color: 'var(--accent-yellow)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.06em' }}>
                    HH GOA 2026
                  </span>
                </div>
              </div>

              {/* Badge Body - Vertically Centered Layout */}
              <div style={{ 
                flex: 1, 
                padding: '1rem 1.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center' 
              }}>
                
                {/* Dashed Pink Avatar Circle */}
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  border: '3px dashed var(--accent-pink)',
                  padding: '4px',
                  marginBottom: '0.75rem',
                  backgroundColor: 'rgba(255, 29, 142, 0.05)'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {photo ? (
                      <img src={photo} alt="Attendee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={36} style={{ color: 'var(--accent-pink)', opacity: 0.6 }} />
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display" style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--accent-yellow)',
                  margin: '0 0 0.2rem 0',
                  lineHeight: 1.15
                }}>
                  {name || 'YOUR NAME'}
                </h3>

                {/* Generated AI Title / Role */}
                <div style={{ 
                  margin: '0.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minHeight: '24px'
                }}>
                  {isGeneratingTitle ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-pink)', fontSize: '0.8rem' }}>
                      <Loader2 size={13} className="spin" />
                      <span className="font-mono">CRAFTING TITLE...</span>
                    </div>
                  ) : (
                    <span className="font-mono" style={{ 
                      backgroundColor: 'var(--accent-pink)', 
                      color: '#ffffff', 
                      fontSize: '0.725rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px',
                      boxShadow: '0 2px 8px rgba(255, 29, 142, 0.3)'
                    }}>
                      {title || 'BUILDER'}
                    </span>
                  )}
                </div>

                {/* Generated Playful Vibe Tag */}
                {vibe && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(251, 243, 227, 0.85)', 
                    fontStyle: 'italic',
                    marginTop: '0.15rem', 
                    fontWeight: 500,
                    letterSpacing: '0.01em'
                  }}>
                    {vibe}
                  </p>
                )}

                {/* Distinct Stack / Context Subtitle */}
                {stack && (
                  <p style={{ fontSize: '0.725rem', color: 'rgba(251, 243, 227, 0.65)', marginTop: '0.1rem', fontWeight: 500 }}>
                    Stack: {stack}
                  </p>
                )}

                {/* Event Secondary Metadata Line to fill spacing cleanly */}
                <div className="font-mono" style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'rgba(251, 243, 227, 0.5)', letterSpacing: '0.1em' }}>
                  HH GOA · 2026 EDITION
                </div>

              </div>

              {/* Badge Footer */}
              <div style={{
                backgroundColor: 'var(--accent-yellow)',
                color: 'var(--bg-green)',
                padding: '0.6rem',
                textAlign: 'center',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.775rem',
                fontWeight: 800,
                letterSpacing: '0.15em'
              }}>
                ✦ #FRAMEINGOA ✦
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* --- STUDIO CREDIT FOOTER --- */}
      <footer className="font-mono" style={{
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderTop: '1px solid rgba(245, 197, 24, 0.1)',
        backgroundColor: 'var(--bg-green-dark)',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: 'rgba(251, 243, 227, 0.8)'
      }}>
        <span>BUILT FOR</span>
        <img 
          src="/2-47.svg" 
          alt="2:47 PM Studio" 
          style={{ height: '18px', filter: 'brightness(1.2)' }} 
        />
        <span>HH GOA 2026 BY DEVESH</span>
      </footer>
    </div>
  );
}

