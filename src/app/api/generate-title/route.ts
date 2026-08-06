import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

function generateCreativeContent(userStack: string): { title: string; vibe: string } {
  const s = userStack.toLowerCase();
  
  let title = 'Tech Maverick';
  let vibe = '⚡ Ships fast, breaks nothing (usually)';

  // Rich multi-keyword fallback combinations
  if (s.includes('python') && s.includes('rust')) {
    title = 'Systems Alchemist';
    vibe = '⚙️ Blazing speed meets snake charm';
  } else if (s.includes('python') && s.includes('java')) {
    title = 'Polyglot Architect';
    vibe = '☕ Class loaders meet pythonic elegance';
  } else if (s.includes('rust')) {
    title = 'Memory Safe Hero';
    vibe = '🦀 Borrow checker whisperer';
  } else if (s.includes('python')) {
    title = 'Snake Wrangler';
    vibe = '🐍 Indents enthusiast & script master';
  } else if (s.includes('java')) {
    title = 'Enterprise Paladin';
    vibe = '☕ AbstractSingletonProxyFactory enjoyer';
  } else if (s.includes('react') || s.includes('next')) {
    title = 'UI Sorcerer';
    vibe = '✨ State updates faster than light';
  } else if (s.includes('solidity') || s.includes('web3') || s.includes('crypto')) {
    title = 'Chain Architect';
    vibe = '⛓️ In it for the gas optimization';
  } else if (s.includes('figma') || s.includes('css') || s.includes('design')) {
    title = 'Pixel Wizard';
    vibe = '🎨 Flexbox Alchemist & UI perfectionist';
  } else if (s.includes('fullstack') || s.includes('full stack')) {
    title = 'Fullstack Maverick';
    vibe = '🔄 DB queries to CSS tweaks in 5s';
  } else if (s.includes('backend') || s.includes('node') || s.includes('go')) {
    title = 'Backend Warlock';
    vibe = '🚀 Goroutines & low latency endpoints';
  } else if (s.includes('ai') || s.includes('ml') || s.includes('llm')) {
    title = 'Neural Wizard';
    vibe = '🧠 Loss function fighter & prompt wizard';
  } else {
    const cleaned = userStack.replace(/\bbuilder\b/gi, '').trim();
    if (cleaned.length > 0) {
      title = `${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)} Architect`;
    }
    const genericVibes = [
      '☕ Turns coffee into clean commits',
      '🌙 Debugging at 3am is a lifestyle',
      '🔀 Merge first, ask questions later',
      '💬 "It works on my machine" certified',
      '🔥 Fixing production in production'
    ];
    let hash = 0;
    for (let i = 0; i < userStack.length; i++) {
      hash = (hash << 5) - hash + userStack.charCodeAt(i);
      hash |= 0;
    }
    vibe = genericVibes[Math.abs(hash) % genericVibes.length];
  }

  return { title, vibe };
}

export async function POST(request: Request) {
  let stack = '';
  try {
    const body = await request.json();
    stack = (body.stack || '').trim();
    
    if (!stack) {
      return NextResponse.json({ error: 'Stack is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are a creative title and vibe tag generator for a tech event called HH Goa 2026. 
Given a user's tech stack or role description ("${stack}"), generate two distinct items:
1. "title": A distinct, creative 1-3 word "builder title" (e.g. "Systems Alchemist", "Polyglot Sorcerer", "Memory Safe Hero").
2. "vibe": A short, funny, highly tailored 3-7 word dev-culture tagline or "vibe line" with an emoji at the start, keying off the specific technologies mentioned in their input.

CRITICAL RULES:
1. NEVER echo or repeat raw stack phrases as the title.
2. If multiple languages/tools are listed (e.g. "python and java and rust"), synthesize them creatively!
3. Output valid JSON only: {"title": "...", "vibe": "..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text?.trim() || '';
    // Strip markdown code fences if present
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    const title = parsed.title || generateCreativeContent(stack).title;
    const vibe = parsed.vibe || generateCreativeContent(stack).vibe;

    return NextResponse.json({ title, vibe });
  } catch (error) {
    console.error('Error generating title & vibe:', error);
    return NextResponse.json(generateCreativeContent(stack));
  }
}

