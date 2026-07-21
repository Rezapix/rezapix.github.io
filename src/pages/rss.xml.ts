import type { APIRoute } from 'astro';
import { generateRSS } from '@/lib/content/rss';

export const GET: APIRoute = () => {
  return new Response(generateRSS(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
