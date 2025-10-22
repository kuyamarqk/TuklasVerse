// app/api/proxy/vidsrc/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Parse the incoming URL
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    // Validate the target URL
    if (!targetUrl || !targetUrl.startsWith('https://vidsrc.to/embed/')) {
      return new Response('Invalid or missing URL', { status: 400 });
    }

    // Fetch the content from the target URL
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://vidsrc.to/',
      },
    });

    if (!upstreamRes.ok) {
      console.error(`Upstream error: ${upstreamRes.status}`);
      return new Response(`Upstream error: ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    const html = await upstreamRes.text();

    // Optional: Strip ad-related scripts
    const cleanedHtml = html
      .replace(/<script[^>]*src="[^"]*ads[^"]*"[^>]*><\/script>/gi, '')
      .replace(/<script[^>]*>[^<]*histats[^<]*<\/script>/gi, '');

    return new Response(cleanedHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Proxy failed:', error);
    return new Response('Proxy failed', { status: 500 });
  }
}
